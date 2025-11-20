/**
 * Health Check Utility
 *
 * Simple health monitoring that logs bot status periodically
 */

import { SeraphimClient } from '../client/SeraphimClient';
import { logger } from './logger';

/**
 * Logs health status at regular intervals
 *
 * @param {SeraphimClient} client - The bot client instance
 * @param {number} intervalMs - Interval in milliseconds (default: 5 minutes)
 * @returns {NodeJS.Timeout} The interval timer
 *
 * @example
 * startHealthMonitoring(client, 300000); // Every 5 minutes
 */
export function startHealthMonitoring(client: SeraphimClient, intervalMs: number = 300000): NodeJS.Timeout {
  const interval = setInterval(() => {
    const discordConnected = client.isReady();
    const connectedNodes = Array.from(client.music.nodeManager.nodes.values()).filter(
      node => node.connected
    ).length;
    const memUsage = process.memoryUsage();
    const memoryMB = Math.round(memUsage.heapUsed / 1024 / 1024);

    // Determine status
    const isHealthy = discordConnected && connectedNodes > 0;

    if (isHealthy) {
      logger.debug('Health check: OK', {
        uptime: `${Math.floor(process.uptime() / 60)}m`,
        guilds: client.guilds.cache.size,
        players: client.music.players.size,
        memoryMB,
      });
    } else {
      logger.warn('Health check: DEGRADED', {
        discordConnected,
        lavalinkNodes: connectedNodes,
        memoryMB,
      });
    }
  }, intervalMs);

  logger.info(`Health monitoring started (interval: ${intervalMs / 1000}s)`);
  return interval;
}
