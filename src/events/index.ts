import { SeraphimClient } from '../client/SeraphimClient';
import { readyEvent } from './ready';
import { interactionCreateEvent } from './interactionCreate';
import { lavalinkEvents } from './lavalink';

export function registerEvents(client: SeraphimClient): void {
  // Discord events
  readyEvent(client);
  interactionCreateEvent(client);

  // Lavalink events
  lavalinkEvents(client);
}
