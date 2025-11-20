/**
 * Secrets Manager
 *
 * Provides utilities for securely loading credentials from environment variables
 * or Docker secrets files. Supports both traditional .env files and Docker secrets.
 *
 * Docker secrets are mounted as files in /run/secrets/ inside containers.
 * This prevents credentials from being exposed via docker inspect.
 */

import { readFileSync, existsSync } from 'fs';
import { logger } from './logger';

/**
 * Reads a secret from either a file (Docker secret) or environment variable
 *
 * Priority order:
 * 1. File specified by {NAME}_FILE environment variable (Docker secrets)
 * 2. Direct environment variable {NAME}
 * 3. Throw error if neither exists and secret is required
 *
 * @param {string} name - Name of the secret (e.g., 'DISCORD_TOKEN')
 * @param {boolean} required - Whether the secret is required (default: true)
 * @returns {string} The secret value
 * @throws {Error} If required secret is not found
 *
 * @example
 * // Docker secret file at /run/secrets/discord_token
 * // Environment: DISCORD_TOKEN_FILE=/run/secrets/discord_token
 * const token = getSecret('DISCORD_TOKEN');
 *
 * @example
 * // Traditional environment variable
 * // Environment: DISCORD_TOKEN=abc123
 * const token = getSecret('DISCORD_TOKEN');
 */
export function getSecret(name: string, required: boolean = true): string {
  // Check for file-based secret first (Docker secrets)
  const fileEnvVar = `${name}_FILE`;
  const secretFile = process.env[fileEnvVar];

  if (secretFile) {
    try {
      if (existsSync(secretFile)) {
        const secret = readFileSync(secretFile, 'utf8').trim();
        logger.debug(`Loaded secret ${name} from file: ${secretFile}`);
        return secret;
      } else {
        logger.warn(`Secret file specified but not found: ${secretFile}`);
      }
    } catch (error) {
      logger.error(`Failed to read secret file ${secretFile}:`, error);
      // Fall through to environment variable check
    }
  }

  // Fall back to environment variable
  const envValue = process.env[name];
  if (envValue) {
    logger.debug(`Loaded secret ${name} from environment variable`);
    return envValue;
  }

  // Secret not found
  if (required) {
    throw new Error(
      `Required secret '${name}' not found. ` +
      `Set either ${name} environment variable or ${fileEnvVar} pointing to a secret file.`
    );
  }

  return '';
}

/**
 * Loads all required secrets and validates them
 *
 * @param {string[]} requiredSecrets - Array of required secret names
 * @returns {Map<string, string>} Map of secret names to values
 * @throws {Error} If any required secret is missing
 *
 * @example
 * const secrets = loadRequiredSecrets(['DISCORD_TOKEN', 'CLIENT_ID', 'LAVALINK_PASSWORD']);
 * const discordToken = secrets.get('DISCORD_TOKEN');
 */
export function loadRequiredSecrets(requiredSecrets: string[]): Map<string, string> {
  const secrets = new Map<string, string>();
  const missing: string[] = [];

  for (const secretName of requiredSecrets) {
    try {
      const value = getSecret(secretName, true);
      secrets.set(secretName, value);
    } catch (error) {
      missing.push(secretName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required secrets: ${missing.join(', ')}\n` +
      `Set these as environment variables or use Docker secrets with _FILE suffix.`
    );
  }

  logger.info(`Successfully loaded ${secrets.size} secrets`);
  return secrets;
}

/**
 * Checks if running in Docker secrets mode
 *
 * @returns {boolean} True if any _FILE environment variables are set
 *
 * @example
 * if (isDockerSecretsMode()) {
 *   console.log('Using Docker secrets');
 * } else {
 *   console.log('Using environment variables');
 * }
 */
export function isDockerSecretsMode(): boolean {
  return Object.keys(process.env).some(key => key.endsWith('_FILE'));
}

/**
 * Redacts a secret for logging purposes
 *
 * Shows only first and last 4 characters, redacts the middle.
 * Useful for debugging without exposing full credentials.
 *
 * @param {string} secret - The secret to redact
 * @returns {string} Redacted secret
 *
 * @example
 * redactSecret('abc123def456ghi789') // 'abc1...h789'
 */
export function redactSecret(secret: string): string {
  if (secret.length <= 8) {
    return '***';
  }
  const start = secret.substring(0, 4);
  const end = secret.substring(secret.length - 4);
  return `${start}...${end}`;
}
