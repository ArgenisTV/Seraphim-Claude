/**
 * Audit Logger
 *
 * Provides structured audit logging for security-relevant events.
 * Tracks user actions, authentication, and security violations.
 */

import { logger } from './logger';

/**
 * Audit event types
 */
export enum AuditEventType {
  // Authentication & Authorization
  COMMAND_EXECUTED = 'COMMAND_EXECUTED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',

  // Security Events
  SSRF_BLOCKED = 'SSRF_BLOCKED',
  INVALID_INPUT = 'INVALID_INPUT',
  MALFORMED_REQUEST = 'MALFORMED_REQUEST',

  // Player Events
  PLAYER_CREATED = 'PLAYER_CREATED',
  PLAYER_DESTROYED = 'PLAYER_DESTROYED',
  TRACK_PLAYED = 'TRACK_PLAYED',

  // Error Events
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
}

/**
 * Audit event severity levels
 */
export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  timestamp: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  guildId?: string;
  details: Record<string, any>;
}

/**
 * Audit Logger Class
 *
 * Provides methods for logging security-relevant events with structured data.
 */
class AuditLogger {
  /**
   * Logs a command execution event
   *
   * @param {string} userId - Discord user ID
   * @param {string} guildId - Discord guild ID
   * @param {string} commandName - Name of the executed command
   * @param {Record<string, any>} metadata - Additional metadata
   */
  public logCommandExecution(
    userId: string,
    guildId: string,
    commandName: string,
    metadata: Record<string, any> = {}
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.COMMAND_EXECUTED,
      severity: AuditSeverity.INFO,
      userId,
      guildId,
      details: {
        command: commandName,
        ...metadata,
      },
    });
  }

  /**
   * Logs a rate limit violation
   *
   * @param {string} userId - Discord user ID
   * @param {number} retryAfter - Time until rate limit resets (ms)
   */
  public logRateLimitExceeded(userId: string, retryAfter: number): void {
    this.log({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
      severity: AuditSeverity.WARNING,
      userId,
      details: {
        retryAfter,
        message: 'User exceeded rate limit',
      },
    });
  }

  /**
   * Logs an SSRF attempt that was blocked
   *
   * @param {string} userId - Discord user ID
   * @param {string} guildId - Discord guild ID
   * @param {string} blockedUrl - The URL that was blocked
   * @param {string} reason - Reason for blocking
   */
  public logSSRFBlocked(
    userId: string,
    guildId: string,
    blockedUrl: string,
    reason: string
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.SSRF_BLOCKED,
      severity: AuditSeverity.CRITICAL,
      userId,
      guildId,
      details: {
        blockedUrl,
        reason,
        message: 'SSRF attack attempt blocked',
      },
    });
  }

  /**
   * Logs invalid input detection
   *
   * @param {string} userId - Discord user ID
   * @param {string} guildId - Discord guild ID
   * @param {string} inputType - Type of input that was invalid
   * @param {string} reason - Reason for rejection
   */
  public logInvalidInput(
    userId: string,
    guildId: string,
    inputType: string,
    reason: string
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.INVALID_INPUT,
      severity: AuditSeverity.WARNING,
      userId,
      guildId,
      details: {
        inputType,
        reason,
      },
    });
  }

  /**
   * Logs a permission denial
   *
   * @param {string} userId - Discord user ID
   * @param {string} guildId - Discord guild ID
   * @param {string} action - Action that was denied
   * @param {string} reason - Reason for denial
   */
  public logPermissionDenied(
    userId: string,
    guildId: string,
    action: string,
    reason: string
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.PERMISSION_DENIED,
      severity: AuditSeverity.WARNING,
      userId,
      guildId,
      details: {
        action,
        reason,
      },
    });
  }

  /**
   * Logs a track played event
   *
   * @param {string} guildId - Discord guild ID
   * @param {string} trackTitle - Title of the track
   * @param {string} trackSource - Source platform (YouTube, Spotify, etc.)
   * @param {string} requestedBy - User ID who requested the track
   */
  public logTrackPlayed(
    guildId: string,
    trackTitle: string,
    trackSource: string,
    requestedBy: string
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.TRACK_PLAYED,
      severity: AuditSeverity.INFO,
      guildId,
      userId: requestedBy,
      details: {
        trackTitle,
        trackSource,
      },
    });
  }

  /**
   * Logs an error event
   *
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Error message
   * @param {Record<string, any>} metadata - Additional metadata
   */
  public logError(
    errorType: string,
    errorMessage: string,
    metadata: Record<string, any> = {}
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      eventType: AuditEventType.ERROR_OCCURRED,
      severity: AuditSeverity.CRITICAL,
      details: {
        errorType,
        errorMessage,
        ...metadata,
      },
    });
  }

  /**
   * Writes audit log entry to storage
   *
   * @param {AuditLogEntry} entry - The audit log entry
   * @private
   */
  private log(entry: AuditLogEntry): void {
    // Log to standard logger with metadata
    const logLevel = this.severityToLogLevel(entry.severity);
    const message = `[AUDIT] ${entry.eventType}`;

    // Redact sensitive data before logging
    const sanitizedEntry = this.sanitizeEntry(entry);

    logger.logWithMetadata(logLevel as any, message, sanitizedEntry);
  }

  /**
   * Sanitizes audit log entry to prevent credential leakage
   *
   * @param {AuditLogEntry} entry - The audit log entry
   * @returns {AuditLogEntry} Sanitized entry
   * @private
   */
  private sanitizeEntry(entry: AuditLogEntry): AuditLogEntry {
    const sanitized = { ...entry };

    // Never log full URLs that might contain tokens
    if (sanitized.details.url) {
      try {
        const url = new URL(sanitized.details.url);
        sanitized.details.url = `${url.protocol}//${url.hostname}${url.pathname}`;
      } catch {
        sanitized.details.url = '[REDACTED]';
      }
    }

    // Redact any potential credential fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    Object.keys(sanitized.details).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized.details[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Converts audit severity to log level
   *
   * @param {AuditSeverity} severity - Audit severity level
   * @returns {string} Log level
   * @private
   */
  private severityToLogLevel(severity: AuditSeverity): string {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return 'ERROR';
      case AuditSeverity.WARNING:
        return 'WARN';
      case AuditSeverity.INFO:
      default:
        return 'INFO';
    }
  }
}

/**
 * Singleton audit logger instance
 */
export const auditLogger = new AuditLogger();
