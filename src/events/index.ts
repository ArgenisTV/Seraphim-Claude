import { SeraphimClient } from '../client/SeraphimClient';
import { readyEvent } from './ready';
import { rawEvent } from './raw';
import { interactionCreateEvent } from './interactionCreate';
import { lavalinkEvents } from './lavalink';

export function registerEvents(client: SeraphimClient): void {
  // Discord events
  readyEvent(client);
  rawEvent(client);
  interactionCreateEvent(client);

  // Lavalink events
  lavalinkEvents(client);
}
