import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { LavalinkManager } from 'lavalink-client';
import { Command } from '../types/Command';
import { logger } from '../utils/logger';
import { registerEvents } from '../events';
import { registerCommands } from '../commands';

export class SeraphimClient extends Client {
  public commands: Collection<string, Command>;
  public music: LavalinkManager;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
      ],
    });

    this.commands = new Collection();
    this.music = this.createMusicManager();
  }

  private createMusicManager(): LavalinkManager {
    return new LavalinkManager({
      nodes: [
        {
          authorization: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
          host: process.env.LAVALINK_HOST || 'lavalink',
          port: parseInt(process.env.LAVALINK_PORT || '2333'),
          id: 'seraphim-node',
          retryAmount: 5,
          retryDelay: 3000,
          secure: false,
        },
      ],
      sendToShard: (guildId, payload) => {
        const guild = this.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
      },
      client: {
        id: process.env.CLIENT_ID!,
        username: 'Seraphim',
      },
      autoSkip: true,
      playerOptions: {
        clientBasedPositionUpdateInterval: 150,
        defaultSearchPlatform: 'ytsearch',
        volumeDecrementer: 0.75,
        onDisconnect: {
          autoReconnect: true,
          destroyPlayer: false,
        },
        onEmptyQueue: {
          destroyAfterMs: 300000, // 5 minutes
        },
        useUnresolvedData: true,
      },
    });
  }

  public async start(): Promise<void> {
    try {
      logger.info('Starting Seraphim Music Bot...');

      // Register commands
      registerCommands(this);
      logger.info(`Loaded ${this.commands.size} commands`);

      // Register events
      registerEvents(this);
      logger.info('Registered event handlers');

      // Register slash commands with Discord
      await this.registerSlashCommands();

      // Login to Discord
      await this.login(process.env.DISCORD_TOKEN);

      // Initialize music manager after login with full user object
      this.music.init({
        id: this.user!.id,
        username: this.user!.username,
      });
      logger.info('Lavalink connection initialized');
    } catch (error) {
      logger.error('Failed to start bot:', error);
      throw error;
    }
  }

  private async registerSlashCommands(): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    const slashCommands = this.commands.map(command => {
      const builder = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description);

      if (command.options) {
        command.options.forEach(option => {
          if (option.type === 'string') {
            builder.addStringOption(opt =>
              opt
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false)
            );
          }
        });
      }

      return builder.toJSON();
    });

    try {
      logger.info('Registering slash commands...');
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
        body: slashCommands,
      });
      logger.info('Successfully registered slash commands');
    } catch (error) {
      logger.error('Failed to register slash commands:', error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down...');
    // Destroy all players
    this.music.players.forEach(player => player.destroy());
    await this.destroy();
    logger.info('Shutdown complete');
  }
}
