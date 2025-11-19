import { Track } from 'erela.js';
import { User } from 'discord.js';

export interface QueueTrack extends Track {
  requester: User;
}
