/**
 * Health Check Utility
 *
 * Monitors bot health and provides status information for monitoring systems.
 * Tracks uptime, memory usage, and connection status.
 */

import { SeraphimClient } from '../client/SeraphimClient';
import { logger } from './logger';

/**
 * Health check status
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  discord: {
    connected: boolean;
    ping: number;
    guilds: number;
  };
  lavalink: {
    connected: boolean;
    nodes: number;
    activePlayers: number;
  };
  system: {
    memoryUsage: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
    platform: string;
    nodeVersion: string;
  };
}

/**
 * Gets current health status of the bot
 *
 * @param {SeraphimClient} client - The bot client instance
 * @returns {HealthStatus} Current health status
 *
 * @example
 * const status = getHealthStatus(client);
 * console.log(`Status: ${status.status}`);
 */
export function getHealthStatus(client: SeraphimClient): HealthStatus {
  const memUsage = process.memoryUsage();

  // Determine overall status
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  const discordConnected = client.isReady();
  const lavalinkNodes = client.music.nodeManager.nodes.size;
  const connectedNodes = Array.from(client.music.nodeManager.nodes.values()).filter(
    node => node.connected
  ).length;

  if (!discordConnected || connectedNodes === 0) {
    status = 'unhealthy';
  } else if (connectedNodes < lavalinkNodes) {
    status = 'degraded';
  }

  // Memory warning (>1GB used)
  const memoryUsedMB = memUsage.heapUsed / 1024 / 1024;
  if (memoryUsedMB > 1024) {
    status = 'degraded';
  }

  return {
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    discord: {
      connected: discordConnected,
      ping: client.ws.ping,
      guilds: client.guilds.cache.size,
    },
    lavalink: {
      connected: connectedNodes > 0,
      nodes: lavalinkNodes,
      activePlayers: client.music.players.size,
    },
    system: {
      memoryUsage: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      },
      platform: process.platform,
      nodeVersion: process.version,
    },
  };
}

/**
 * Logs health status at regular intervals
 *
 * @param {SeraphimClient} client - The bot client instance
 * @param {number} intervalMs - Interval in milliseconds (default: 5 minutes)
 *
 * @example
 * // Start periodic health logging
 * startHealthMonitoring(client, 300000); // Every 5 minutes
 */
export function startHealthMonitoring(client: SeraphimClient, intervalMs: number = 300000): NodeJS.Timeout {
  const interval = setInterval(() => {
    const status = getHealthStatus(client);

    if (status.status === 'healthy') {
      logger.debug('Health check:', {
        status: status.status,
        uptime: `${Math.floor(status.uptime / 60)} minutes`,
        guilds: status.discord.guilds,
        players: status.lavalink.activePlayers,
        memoryMB: status.system.memoryUsage.heapUsed,
      });
    } else {
      logger.warn('Health check - degraded/unhealthy:', {
        status: status.status,
        discord: status.discord,
        lavalink: status.lavalink,
        memoryMB: status.system.memoryUsage.heapUsed,
      });
    }
  }, intervalMs);

  logger.info(`Health monitoring started (interval: ${intervalMs / 1000}s)`);

  return interval;
}

/**
 * Gets a simple health check response (for HTTP endpoints)
 *
 * @param {SeraphimClient} client - The bot client instance
 * @returns {Object} Simple health response
 *
 * @example
 * // Express endpoint
 * app.get('/health', (req, res) => {
 *   const health = getSimpleHealth(client);
 *   res.status(health.ok ? 200 : 503).json(health);
 * });
 */
export function getSimpleHealth(client: SeraphimClient): { ok: boolean; status: string } {
  const status = getHealthStatus(client);
  return {
    ok: status.status === 'healthy',
    status: status.status,
  };
}

/**
 * Checks if bot is ready for traffic
 *
 * @param {SeraphimClient} client - The bot client instance
 * @returns {boolean} True if bot is ready
 */
export function isReady(client: SeraphimClient): boolean {
  return client.isReady() && client.music.nodeManager.nodes.size > 0;
}
