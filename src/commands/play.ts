import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';
import { checkVoicePermissions, getPermissionErrorMessage } from '../utils/voiceValidation';
import { isInGuild, GUILD_ONLY_ERROR } from '../utils/guildValidation';
import { validateQuery } from '../utils/queryValidation';

/**
 * Play Command
 *
 * Plays music from various sources including YouTube, Spotify, Apple Music,
 * Deezer, SoundCloud, and Bandcamp. Supports both direct URLs and search queries.
 *
 * Features:
 * - Creates/connects to voice channel
 * - Handles playlists and single tracks
 * - Queues tracks if music is already playing
 * - Automatic playback start
 *
 * @example
 * // Play by search
 * /play query:never gonna give you up
 *
 * // Play by URL
 * /play query:https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *
 * // Play Spotify
 * /play query:https://open.spotify.com/track/...
 */
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
  /**
   * Executes the play command
   *
   * @param {SeraphimClient} client - The bot client instance
   * @param {ChatInputCommandInteraction} interaction - Discord slash command interaction
   * @returns {Promise<void>} Resolves when command completes
   * @throws {Error} If playback fails or voice channel is invalid
   */
  async execute(client: SeraphimClient, interaction: ChatInputCommandInteraction) {
    // Defer reply immediately to prevent timeout
    await interaction.deferReply();

    // Ensure command is executed in a guild
    if (!isInGuild(interaction)) {
      await interaction.editReply({
        embeds: [createErrorEmbed(GUILD_ONLY_ERROR)],
      });
      return;
    }

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Thou must dwell within a voice channel to summon the celestial harmonies.')],
      });
      return;
    }

    // Check if bot has permissions to join and speak
    const permissions = checkVoicePermissions(voiceChannel);
    if (!permissions.canConnect || !permissions.canSpeak) {
      await interaction.editReply({
        embeds: [createErrorEmbed(getPermissionErrorMessage(permissions.missingPermissions))],
      });
      return;
    }

    const query = interaction.options.getString('query', true);

    // Validate and sanitize the query
    const validation = validateQuery(query);
    if (!validation.isValid) {
      // Log validation failure
      if (validation.error?.includes('Security restriction:')) {
        logger.warn('SSRF attempt blocked', {
          userId: interaction.user.id,
          guildId: interaction.guildId,
          query,
          error: validation.error,
        });
      } else {
        logger.debug('Invalid query', {
          userId: interaction.user.id,
          guildId: interaction.guildId,
          error: validation.error,
        });
      }

      await interaction.editReply({
        embeds: [createErrorEmbed(validation.error || 'Invalid query.')],
      });
      return;
    }

    let sanitizedQuery = validation.sanitized;

    // Strip playlist parameter from YouTube URLs if it's a single video
    // YouTube URLs with &list= will be treated as playlists by Lavalink
    // We only want the single video if the URL points to a specific video
    if (sanitizedQuery.includes('youtube.com/watch?v=') || sanitizedQuery.includes('youtu.be/')) {
      try {
        const url = new URL(sanitizedQuery);
        // If URL has both a video ID and a playlist parameter, remove the playlist
        if (url.searchParams.has('v') && url.searchParams.has('list')) {
          url.searchParams.delete('list');
          url.searchParams.delete('index');
          sanitizedQuery = url.toString();
          logger.debug(`Stripped playlist parameter from YouTube URL: ${sanitizedQuery}`);
        } else if (sanitizedQuery.includes('youtu.be/') && sanitizedQuery.includes('?list=')) {
          // Handle youtu.be short URLs
          sanitizedQuery = sanitizedQuery.split('?')[0];
          logger.debug(`Stripped playlist parameter from short YouTube URL: ${sanitizedQuery}`);
        }
      } catch (err) {
        // If URL parsing fails, continue with original query
        logger.debug('Failed to parse YouTube URL, using original query');
      }
    }

    try {
      // Get or create player
      let player = client.music.getPlayer(interaction.guildId!);
      const isNewPlayer = !player;

      if (!player) {
        // Note: DEFAULT_VOLUME is validated at startup to be 0-100
        const volume = Math.max(0, Math.min(100, parseInt(process.env.DEFAULT_VOLUME || '50')));
        player = client.music.createPlayer({
          guildId: interaction.guildId!,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          volume: volume,
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

      // Search for tracks using the player (use sanitized query)
      let res;
      let usedFallback = false;

      try {
        res = await player.search(
          {
            query: sanitizedQuery,
          },
          interaction.user
        );
      } catch (error: any) {
        // Check if it's a Spotify error and fall back to YouTube search
        if (error?.message?.includes('spotify') && sanitizedQuery.includes('spotify.com')) {
          logger.info('Spotify not available, falling back to YouTube search');

          // Extract track info from Spotify URL and search on YouTube
          // Format: ytsearch:track name
          const fallbackQuery = 'ytsearch:' + sanitizedQuery.split('/').pop()?.split('?')[0];

          try {
            res = await player.search(
              {
                query: fallbackQuery,
              },
              interaction.user
            );
            usedFallback = true;
          } catch (fallbackError) {
            logger.error('Fallback search also failed:', fallbackError);
            throw error; // Rethrow original error
          }
        } else {
          throw error; // Rethrow if not a Spotify error
        }
      }

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

        // Build success message
        let message = `Attuning to: **${track.info.title}**`;
        if (usedFallback) {
          message += '\n*Found via YouTube (Spotify unavailable)*';
        }

        if (!player.playing && !player.paused) {
          await interaction.editReply({
            embeds: [createSuccessEmbed(message)],
          });
        } else {
          await interaction.editReply({
            embeds: [
              createSuccessEmbed(
                message + '\n*This harmony shall join the celestial queue.*'
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
