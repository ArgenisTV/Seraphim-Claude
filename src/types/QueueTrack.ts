import { Track } from 'lavalink-client';
import { User } from 'discord.js';

export interface QueueTrack extends Track {
  requester: User;
}
