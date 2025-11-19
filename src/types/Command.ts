import { ChatInputCommandInteraction } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';

export interface CommandOption {
  name: string;
  description: string;
  type: 'string' | 'integer' | 'boolean';
  required?: boolean;
}

export interface Command {
  name: string;
  description: string;
  options?: CommandOption[];
  execute: (client: SeraphimClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}
