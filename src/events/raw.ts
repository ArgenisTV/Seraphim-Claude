import { SeraphimClient } from '../client/SeraphimClient';

export function rawEvent(client: SeraphimClient): void {
  // Forward raw Discord gateway events to Lavalink
  // This is required for voice state updates
  client.on('raw', (data) => {
    client.music.updateVoiceState(data);
  });
}
