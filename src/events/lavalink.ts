import { SeraphimClient } from '../client/SeraphimClient';
import { logger } from '../utils/logger';
import { updateNowPlayingMessage } from '../handlers/nowPlayingHandler';

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
    await updateNowPlayingMessage(client, player, track);
  });

  client.music.on('trackEnd', (player, track) => {
    if (!track) return;
    logger.debug(`Track ended: ${track.info.title} in guild ${player.guildId}`);
  });

  client.music.on('trackStuck', (player, track, payload) => {
    if (!track) return;
    logger.error(`Track stuck: ${track.info.title} in guild ${player.guildId}`, payload);
    player.skip(); // Skip to next track
  });

  client.music.on('trackError', (player, track, payload) => {
    if (!track) return;
    logger.error(`Track error: ${track.info.title} in guild ${player.guildId}`, payload);
    player.skip(); // Skip to next track
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

    // Send disconnect message if appropriate
    if (reason === 'QueueEmpty' || reason === 'PlayerInactivity') {
      const channel = client.channels.cache.get(player.textChannelId!);
      if (channel && 'send' in channel) {
        channel.send('**Cosmical vibrations\' resonance attenuated...**');
      }
    }
  });
}
