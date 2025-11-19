import { SeraphimClient } from '../client/SeraphimClient';
import { logger } from '../utils/logger';

export function readyEvent(client: SeraphimClient): void {
  client.once('ready', () => {
    logger.info(`Logged in as ${client.user?.tag}`);
    logger.info(`Ready to play music in ${client.guilds.cache.size} servers`);

    // Set bot status
    client.user?.setPresence({
      activities: [{ name: 'cosmic vibrations | /play', type: 2 }], // Type 2 = Listening
      status: 'online',
    });
  });
}
