import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';
import { SearchResult } from 'erela.js';

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
        embeds: [createErrorEmbed('You must be in a voice channel to play music!')],
      });
      return;
    }

    const query = interaction.options.getString('query', true);

    try {
      // Search for tracks
      let res: SearchResult;

      if (query.match(/^https?:\/\//)) {
        // It's a URL
        res = await client.music.search(query, interaction.user);
      } else {
        // It's a search query
        res = await client.music.search(`ytsearch:${query}`, interaction.user);
      }

      if (res.loadType === 'error' || res.loadType === 'empty') {
        await interaction.editReply({
          embeds: [createErrorEmbed('No results found for your query.')],
        });
        return;
      }

      // Get or create player
      const player = client.music.create({
        guild: interaction.guildId!,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channelId,
        selfDeafen: true,
        volume: parseInt(process.env.DEFAULT_VOLUME || '50'),
      });

      // Connect to voice channel if not connected
      if (player.state !== 'CONNECTED') {
        player.connect();
      }

      // Handle playlist vs single track
      if (res.loadType === 'playlist') {
        // Add all tracks to queue
        for (const track of res.tracks) {
          (track as any).requester = interaction.user;
          player.queue.add(track);
        }

        await interaction.editReply({
          embeds: [
            createSuccessEmbed(
              `Added playlist **${res.playlist?.name}** with **${res.tracks.length}** tracks to the queue.`
            ),
          ],
        });
      } else {
        // Add single track
        const track = res.tracks[0];
        (track as any).requester = interaction.user;
        player.queue.add(track);

        if (!player.playing && !player.paused) {
          await interaction.editReply({
            embeds: [createSuccessEmbed(`Now playing **${track.title}**`)],
          });
        } else {
          await interaction.editReply({
            embeds: [createSuccessEmbed(`Added **${track.title}** to the queue.`)],
          });
        }
      }

      // Start playing if not already
      if (!player.playing && !player.paused && player.queue.totalSize > 0) {
        player.play();
      }
    } catch (error) {
      logger.error('Error in play command:', error);
      await interaction.editReply({
        embeds: [createErrorEmbed('An error occurred while trying to play that track.')],
      });
    }
  },
};
