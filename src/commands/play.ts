import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';

export const playCommand: Command = {
  name: 'play',
  description: 'Play a song from YouTube, Spotify, or SoundCloud',
  options: [
    {
      name: 'query',
      description: 'Song name, URL, or playlist URL',
      type: 'string',
      required: true,
    },
  ],
  async execute(client: SeraphimClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Thou must dwell within a voice channel to summon the celestial harmonies.')],
      });
      return;
    }

    const query = interaction.options.getString('query', true);

    try {
      // Get or create player
      let player = client.music.getPlayer(interaction.guildId!);
      const isNewPlayer = !player;

      if (!player) {
        player = client.music.createPlayer({
          guildId: interaction.guildId!,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          volume: parseInt(process.env.DEFAULT_VOLUME || '50'),
        });
      }

      // Connect to voice channel if not connected
      if (isNewPlayer) {
        await player.connect();
        // Send join message to text channel
        const channel = await client.channels.fetch(interaction.channelId);
        if (channel && 'send' in channel) {
          await channel.send('**Heed Seraphim! Be not afraid!**');
        }
      }

      // Search for tracks using the player
      const res = await player.search(
        {
          query: query,
        },
        interaction.user
      );

      // Handle search failures
      if (!res || !res.tracks || res.tracks.length === 0) {
        await interaction.editReply({
          embeds: [createErrorEmbed('The ethereal realm yielded no resonance for thy seeking.')],
        });
        return;
      }

      // Handle playlist vs single track
      if (res.loadType === 'playlist') {
        // Add all tracks to queue
        await player.queue.add(res.tracks);

        await interaction.editReply({
          embeds: [
            createSuccessEmbed(
              `Attuning to playlist **${res.playlist?.name || 'Unknown'}** - ${res.tracks.length} harmonies shall resonate through the cosmos.`
            ),
          ],
        });
      } else {
        // Add single track (first result from search or direct track)
        const track = res.tracks[0];
        await player.queue.add(track);

        if (!player.playing && !player.paused) {
          await interaction.editReply({
            embeds: [createSuccessEmbed(`Attuning to: **${track.info.title}**`)],
          });
        } else {
          await interaction.editReply({
            embeds: [
              createSuccessEmbed(
                `Attuning to: **${track.info.title}**\n*This harmony shall join the celestial queue.*`
              ),
            ],
          });
        }
      }

      // Start playing if not already
      if (!player.playing && !player.paused) {
        await player.play();
      }
    } catch (error) {
      logger.error('Error in play command:', error);
      await interaction.editReply({
        embeds: [createErrorEmbed('The cosmic forces have disrupted the resonance. Seek thy harmony anew.')],
      });
    }
  },
};
