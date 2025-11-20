/**
 * Log Rotation Utilities
 *
 * Provides utilities for managing log file rotation to prevent disk space exhaustion
 * and maintain manageable log file sizes.
 *
 * Rotation strategies:
 * - Size-based: Rotate when log exceeds max size
 * - Time-based: Rotate daily/weekly
 * - Count-based: Keep only last N log files
 */

import { existsSync, statSync, renameSync, unlinkSync, readdirSync } from 'fs';
import { join } from 'path';
import { logger } from './logger';

/**
 * Log rotation configuration
 */
export interface LogRotationConfig {
  /** Maximum log file size in bytes (default: 10MB) */
  maxSize: number;

  /** Maximum number of rotated logs to keep (default: 5) */
  maxFiles: number;

  /** Log directory path */
  logDirectory: string;

  /** Base log filename (without extension) */
  logFileName: string;
}

/**
 * Default log rotation configuration
 */
const DEFAULT_CONFIG: LogRotationConfig = {
  maxSize: 10 * 1024 * 1024, // 10 MB
  maxFiles: 5,
  logDirectory: './logs',
  logFileName: 'app.log',
};

/**
 * Checks if a log file needs rotation based on size
 *
 * @param {string} filePath - Path to the log file
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {boolean} True if file should be rotated
 */
export function shouldRotate(filePath: string, maxSize: number): boolean {
  if (!existsSync(filePath)) {
    return false;
  }

  try {
    const stats = statSync(filePath);
    return stats.size >= maxSize;
  } catch (error) {
    logger.error(`Failed to check file size for ${filePath}:`, error);
    return false;
  }
}

/**
 * Rotates a log file by renaming it with a numeric suffix
 *
 * Example:
 * - app.log -> app.log.1
 * - app.log.1 -> app.log.2
 * - app.log.2 -> app.log.3
 * - etc.
 *
 * @param {LogRotationConfig} config - Rotation configuration
 */
export function rotateLog(config: LogRotationConfig = DEFAULT_CONFIG): void {
  const logPath = join(config.logDirectory, config.logFileName);

  if (!existsSync(logPath)) {
    return; // No log file to rotate
  }

  try {
    // Delete the oldest log file if it exists
    const oldestLog = join(config.logDirectory, `${config.logFileName}.${config.maxFiles}`);
    if (existsSync(oldestLog)) {
      unlinkSync(oldestLog);
      logger.debug(`Deleted oldest log: ${oldestLog}`);
    }

    // Rotate existing numbered logs
    for (let i = config.maxFiles - 1; i >= 1; i--) {
      const oldLog = join(config.logDirectory, `${config.logFileName}.${i}`);
      const newLog = join(config.logDirectory, `${config.logFileName}.${i + 1}`);

      if (existsSync(oldLog)) {
        renameSync(oldLog, newLog);
        logger.debug(`Rotated ${oldLog} -> ${newLog}`);
      }
    }

    // Rotate current log to .1
    const firstRotated = join(config.logDirectory, `${config.logFileName}.1`);
    renameSync(logPath, firstRotated);
    logger.info(`Rotated log file: ${logPath} -> ${firstRotated}`);
  } catch (error) {
    logger.error('Failed to rotate log file:', error);
  }
}

/**
 * Checks and rotates log if necessary
 *
 * Call this periodically (e.g., on application start or via cron)
 *
 * @param {Partial<LogRotationConfig>} config - Rotation configuration (partial)
 *
 * @example
 * // Check and rotate on startup
 * checkAndRotate({ logDirectory: './logs', logFileName: 'app.log' });
 */
export function checkAndRotate(config: Partial<LogRotationConfig> = {}): void {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const logPath = join(fullConfig.logDirectory, fullConfig.logFileName);

  if (shouldRotate(logPath, fullConfig.maxSize)) {
    logger.info(`Log file ${logPath} exceeds ${fullConfig.maxSize} bytes, rotating...`);
    rotateLog(fullConfig);
  }
}

/**
 * Cleans up old log files beyond the retention limit
 *
 * @param {LogRotationConfig} config - Rotation configuration
 */
export function cleanupOldLogs(config: LogRotationConfig = DEFAULT_CONFIG): void {
  try {
    const files = readdirSync(config.logDirectory);

    // Find all rotated log files
    const logPattern = new RegExp(`^${config.logFileName}\\.\\d+$`);
    const logFiles = files
      .filter(file => logPattern.test(file))
      .map(file => ({
        name: file,
        path: join(config.logDirectory, file),
        number: parseInt(file.split('.').pop() || '0', 10),
      }))
      .sort((a, b) => b.number - a.number); // Sort descending by number

    // Delete files beyond retention limit
    const toDelete = logFiles.slice(config.maxFiles);
    for (const file of toDelete) {
      unlinkSync(file.path);
      logger.info(`Deleted old log file: ${file.name}`);
    }

    if (toDelete.length > 0) {
      logger.info(`Cleaned up ${toDelete.length} old log file(s)`);
    }
  } catch (error) {
    logger.error('Failed to cleanup old logs:', error);
  }
}

/**
 * Gets the total size of all log files in bytes
 *
 * @param {string} logDirectory - Directory containing log files
 * @returns {number} Total size in bytes
 */
export function getTotalLogSize(logDirectory: string): number {
  try {
    const files = readdirSync(logDirectory);
    let totalSize = 0;

    for (const file of files) {
      const filePath = join(logDirectory, file);
      if (file.endsWith('.log') || /\.log\.\d+$/.test(file)) {
        const stats = statSync(filePath);
        totalSize += stats.size;
      }
    }

    return totalSize;
  } catch (error) {
    logger.error('Failed to calculate total log size:', error);
    return 0;
  }
}

/**
 * Starts automatic log rotation at a specified interval
 *
 * @param {number} intervalMs - Check interval in milliseconds (default: 1 hour)
 * @param {Partial<LogRotationConfig>} config - Rotation configuration
 * @returns {NodeJS.Timeout} Interval timer (call clearInterval to stop)
 *
 * @example
 * // Check every hour
 * const rotationTimer = startAutoRotation(3600000);
 *
 * // Stop rotation
 * stopAutoRotation(rotationTimer);
 */
export function startAutoRotation(
  intervalMs: number = 3600000,
  config: Partial<LogRotationConfig> = {}
): NodeJS.Timeout {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  logger.info(`Starting automatic log rotation (check every ${intervalMs}ms)`);

  // Perform initial check
  checkAndRotate(fullConfig);

  // Set up periodic rotation
  return setInterval(() => {
    checkAndRotate(fullConfig);
    cleanupOldLogs(fullConfig);
  }, intervalMs);
}

/**
 * Stops automatic log rotation
 *
 * @param {NodeJS.Timeout} timer - Timer returned from startAutoRotation
 *
 * @example
 * const timer = startAutoRotation();
 * // Later...
 * stopAutoRotation(timer);
 */
export function stopAutoRotation(timer: NodeJS.Timeout): void {
  clearInterval(timer);
  logger.info('Stopped automatic log rotation');
}
