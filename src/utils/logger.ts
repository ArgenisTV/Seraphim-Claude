/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Production-Ready Logger
 *
 * Provides structured logging with timestamps, log levels, and environment-based filtering.
 * Supports INFO, WARN, ERROR, and DEBUG levels.
 */

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private environment: string;
  private minLevel: LogLevel;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';

    // In production, suppress DEBUG logs by default
    this.minLevel = this.environment === 'production' && process.env.DEBUG !== 'true'
      ? LogLevel.INFO
      : LogLevel.DEBUG;
  }

  /**
   * Formats log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();

    // Format arguments
    const formattedArgs = args.length > 0 ? ' ' + args.map(arg => {
      // Special handling for Error objects
      if (arg instanceof Error) {
        return `${arg.name}: ${arg.message}\n${arg.stack || ''}`;
      }
      // Pretty print objects
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ') : '';

    // Add environment and process info in production
    if (this.environment === 'production') {
      return `[${timestamp}] [${this.environment}] [${level}] ${message}${formattedArgs}`;
    }

    return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentIndex = levels.indexOf(level);
    const minIndex = levels.indexOf(this.minLevel);
    return currentIndex >= minIndex;
  }

  /**
   * Log info message
   */
  public info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(LogLevel.INFO, message, ...args));
    }
  }

  /**
   * Log warning message
   */
  public warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, ...args));
    }
  }

  /**
   * Log error message
   */
  public error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message, ...args));
    }
  }

  /**
   * Log debug message (only in development or when DEBUG=true)
   */
  public debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG) && (this.environment !== 'production' || process.env.DEBUG === 'true')) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, ...args));
    }
  }

  /**
   * Log with custom metadata (for structured logging)
   */
  public logWithMetadata(level: LogLevel, message: string, metadata: Record<string, any> = {}): void {
    const enrichedMessage = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: this.environment,
      ...metadata,
    };

    const output = JSON.stringify(enrichedMessage);

    switch (level) {
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.DEBUG:
        if (this.shouldLog(LogLevel.DEBUG)) {
          console.debug(output);
        }
        break;
      default:
        console.log(output);
    }
  }
}

export const logger = new Logger();
