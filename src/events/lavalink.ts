import { SeraphimClient } from '../client/SeraphimClient';
import { logger } from '../utils/logger';
import { Player, Track, TrackExceptionEvent, TrackStuckEvent } from 'erela.js';
import { updateNowPlayingMessage } from '../handlers/nowPlayingHandler';

export function lavalinkEvents(client: SeraphimClient): void {
  // Node connected
  client.music.on('nodeConnect', (node) => {
    logger.info(`Lavalink node "${node.options.identifier}" connected`);
  });

  // Node reconnected
  client.music.on('nodeReconnect', (node) => {
    logger.warn(`Lavalink node "${node.options.identifier}" reconnecting...`);
  });

  // Node disconnected
  client.music.on('nodeDisconnect', (node, reason) => {
    logger.error(`Lavalink node "${node.options.identifier}" disconnected:`, reason);
  });

  // Node error
  client.music.on('nodeError', (node, error) => {
    logger.error(`Lavalink node "${node.options.identifier}" error:`, error);
  });

  // Track starts
  client.music.on('trackStart', async (player: Player, track: Track) => {
    logger.info(`Now playing: ${track.title} in guild ${player.guild}`);
    await updateNowPlayingMessage(client, player, track);
  });

  // Track ends
  client.music.on('trackEnd', (player: Player, track: Track) => {
    logger.debug(`Track ended: ${track.title} in guild ${player.guild}`);
  });

  // Track stuck
  client.music.on('trackStuck', (player: Player, track: Track, data: TrackStuckEvent) => {
    logger.error(`Track stuck: ${track.title} in guild ${player.guild}`, data);
    player.stop(); // Skip to next track
  });

  // Track error
  client.music.on('trackException', (player: Player, track: Track, data: TrackExceptionEvent) => {
    logger.error(`Track error: ${track.title} in guild ${player.guild}`, data);
    player.stop(); // Skip to next track
  });

  // Queue ends
  client.music.on('queueEnd', (player: Player) => {
    logger.info(`Queue ended in guild ${player.guild}`);

    const channel = client.channels.cache.get(player.textChannel!);
    if (channel && 'send' in channel) {
      channel.send('*The celestial harmonies have ceased... Summon more vibrations with `/play`.*');
    }

    // Disconnect after 5 minutes of inactivity
    setTimeout(() => {
      if (player.queue.size === 0 && !player.playing) {
        const disconnectChannel = client.channels.cache.get(player.textChannel!);
        if (disconnectChannel && 'send' in disconnectChannel) {
          disconnectChannel.send('**Cosmical vibrations\' resonance attenuated...**');
        }
        player.destroy();
        logger.info(`Player destroyed due to inactivity in guild ${player.guild}`);
      }
    }, 300000); // 5 minutes
  });

  // Player moved voice channel
  client.music.on('playerMove', (player: Player, oldChannel: string, newChannel: string) => {
    logger.info(`Player moved from ${oldChannel} to ${newChannel} in guild ${player.guild}`);
    player.setVoiceChannel(newChannel);
  });

  // Player destroyed
  client.music.on('playerDestroy', (player: Player) => {
    logger.info(`Player destroyed in guild ${player.guild}`);

    // Send disconnect message if not already sent by queueEnd
    const channel = client.channels.cache.get(player.textChannel!);
    if (channel?.isTextBased() && player.queue.size === 0) {
      // Only send if queue was manually cleared (stop command sends its own message)
      // This will be sent when bot is kicked or loses connection
    }
  });
}
