import { SeraphimClient } from '../client/SeraphimClient';
import { playCommand } from './play';
import { pauseCommand } from './pause';
import { skipCommand } from './skip';
import { backCommand } from './back';
import { shuffleCommand } from './shuffle';
import { queueCommand } from './queue';
import { nowplayingCommand } from './nowplaying';
import { stopCommand } from './stop';

export function registerCommands(client: SeraphimClient): void {
  const commands = [
    playCommand,
    pauseCommand,
    skipCommand,
    backCommand,
    shuffleCommand,
    queueCommand,
    nowplayingCommand,
    stopCommand,
  ];

  commands.forEach((command) => {
    client.commands.set(command.name, command);
  });
}
