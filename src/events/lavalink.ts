import { Track } from 'lavalink-client';
import { SeraphimClient } from '../client/SeraphimClient';
import { logger } from '../utils/logger';
import { updateNowPlayingMessage, cleanupNowPlayingMessage } from '../handlers/nowPlayingHandler';
import { tryAlternativeSource, cleanupRetryTracking, resetRetryCount } from '../utils/sourceFallback';
import { addToHistory, clearHistory } from '../utils/trackHistory';

export function lavalinkEvents(client: SeraphimClient): void {
  // Node events - accessed through nodeManager
  client.music.nodeManager.on('connect', (node) => {
    logger.info(`Lavalink node "${node.id}" connected`);
  });

  client.music.nodeManager.on('reconnecting', (node) => {
    logger.warn(`Lavalink node "${node.id}" reconnecting...`);
  });

  client.music.nodeManager.on('disconnect', (node, reason) => {
    logger.error(`Lavalink node "${node.id}" disconnected:`, reason);
  });

  client.music.nodeManager.on('error', (node, error) => {
    logger.error(`Lavalink node "${node.id}" error:`, error);
  });

  // Player/Track events - accessed through main manager
  client.music.on('trackStart', async (player, track) => {
    if (!track) return;
    logger.info(`Now playing: ${track.info.title} in guild ${player.guildId}`);

    // Reset retry count on successful playback
    resetRetryCount(track);

    await updateNowPlayingMessage(client, player, track);
  });

  client.music.on('trackEnd', (player, track, payload) => {
    if (!track) return;
    logger.debug(`Track ended: ${track.info.title} in guild ${player.guildId}`);

    // Add to history only if track finished normally (not skipped, stopped, or replaced)
    if (payload.reason === 'finished') {
      addToHistory(player.guildId, track);
      logger.debug(`Added track to history: ${track.info.title}`);
    }
  });

  client.music.on('trackStuck', async (player, track, payload) => {
    if (!track) return;
    logger.error(`Track stuck: ${track.info.title} in guild ${player.guildId}`, payload);

    // Try to find alternative source
    const foundAlternative = await tryAlternativeSource(player, track);

    if (!foundAlternative) {
      // No alternative found, skip to next track
      logger.warn(`No alternative source found for stuck track, skipping: ${track.info.title}`);

      const channel = client.channels.cache.get(player.textChannelId!);
      if (channel && 'send' in channel) {
        channel.send(`⚠️ Unable to play **${track.info.title}** - skipping to next track.`);
      }

      await player.skip();
    }
  });

  client.music.on('trackError', async (player, track, payload) => {
    if (!track) return;
    logger.error(`Track error: ${track.info.title} in guild ${player.guildId}`, payload);

    // Only try alternative source if track is fully resolved (has identifier)
    if (track.info.identifier) {
      // Track is resolved, safe to cast to Track type
      const resolvedTrack = track as Track;

      // Try to find alternative source
      const foundAlternative = await tryAlternativeSource(player, resolvedTrack);

      if (!foundAlternative) {
        // No alternative found, skip to next track
        logger.warn(`No alternative source found for errored track, skipping: ${track.info.title}`);

        const channel = client.channels.cache.get(player.textChannelId!);
        if (channel && 'send' in channel) {
          channel.send(`⚠️ Unable to play **${track.info.title}** - skipping to next track.`);
        }

        await player.skip();
      }
    } else {
      // Unresolved track error - skip immediately
      logger.warn(`Unresolved track error, skipping: ${track.info.title}`);
      await player.skip();
    }
  });

  client.music.on('queueEnd', (player) => {
    logger.info(`Queue ended in guild ${player.guildId}`);

    const channel = client.channels.cache.get(player.textChannelId!);
    if (channel && 'send' in channel) {
      channel.send('*The celestial harmonies have ceased... Summon more vibrations with `/play`.*');
    }

    // Note: onEmptyQueue.destroyAfterMs handles automatic disconnection
    // This message will be sent when queue ends, destruction happens automatically
  });

  client.music.on('playerMove', (player, oldChannel, newChannel) => {
    logger.info(`Player moved from ${oldChannel} to ${newChannel} in guild ${player.guildId}`);
    // Player automatically handles voice channel updates in lavalink-client
  });

  client.music.on('playerDestroy', (player, reason) => {
    logger.info(`Player destroyed in guild ${player.guildId}, reason: ${reason}`);

    // Clean up now playing message to prevent memory leak
    cleanupNowPlayingMessage(player.guildId);

    // Clean up retry tracking to prevent memory leak
    cleanupRetryTracking(player.guildId);

    // Clear track history to prevent memory leak
    clearHistory(player.guildId);

    // Send disconnect message if appropriate
    if (reason === 'QueueEmpty' || reason === 'PlayerInactivity') {
      const channel = client.channels.cache.get(player.textChannelId!);
      if (channel && 'send' in channel) {
        channel.send('**Cosmical vibrations\' resonance attenuated...**');
      }
    }
  });
}
