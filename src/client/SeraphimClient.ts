import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { Manager } from 'erela.js';
import Spotify from 'erela.js-spotify';
import { Command } from '../types/Command';
import { logger } from '../utils/logger';
import { registerEvents } from '../events';
import { registerCommands } from '../commands';

export class SeraphimClient extends Client {
  public commands: Collection<string, Command>;
  public music: Manager;

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

  private createMusicManager(): Manager {
    const nodes = [
      {
        host: process.env.LAVALINK_HOST || 'lavalink',
        port: parseInt(process.env.LAVALINK_PORT || '2333'),
        password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
        retryAmount: 5,
        retryDelay: 3000,
        secure: false,
      },
    ];

    const plugins = [];

    // Add Spotify plugin if credentials are provided
    if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
      plugins.push(
        new Spotify({
          clientID: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          convertUnresolved: true,
          playlistLimit: 100,
          albumLimit: 100,
        })
      );
      logger.info('Spotify support enabled');
    }

    return new Manager({
      nodes,
      plugins,
      send: (id, payload) => {
        const guild = this.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
      autoPlay: true,
      clientName: 'Seraphim/1.0',
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

      // Initialize music manager after login
      this.music.init(this.user!.id);
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
    this.music.destroy();
    await this.destroy();
    logger.info('Shutdown complete');
  }
}
