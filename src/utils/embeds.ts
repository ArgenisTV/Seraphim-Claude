import { EmbedBuilder } from 'discord.js';
import { Track } from 'erela.js';
import { QueueTrack } from '../types/QueueTrack';

export function createNowPlayingEmbed(track: QueueTrack): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🎵 Now Playing')
    .setDescription(`**[${track.title}](${track.uri})**`)
    .addFields(
      { name: 'Artist', value: track.author || 'Unknown', inline: true },
      { name: 'Duration', value: formatDuration(track.duration), inline: true },
      { name: 'Requested by', value: track.requester.toString(), inline: true }
    )
    .setThumbnail(track.thumbnail || null)
    .setTimestamp();
}

export function createQueueEmbed(queue: QueueTrack[], currentTrack: QueueTrack): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📜 Music Queue')
    .setDescription(`**Now Playing:**\n[${currentTrack.title}](${currentTrack.uri})\n\n**Up Next:**`)
    .setTimestamp();

  const upNext = queue.slice(0, 10).map((track, index) =>
    `${index + 1}. [${track.title}](${track.uri}) - ${formatDuration(track.duration)}`
  ).join('\n');

  if (upNext) {
    embed.setDescription(
      `**Now Playing:**\n[${currentTrack.title}](${currentTrack.uri})\n\n**Up Next:**\n${upNext}`
    );
  }

  if (queue.length > 10) {
    embed.setFooter({ text: `And ${queue.length - 10} more tracks...` });
  }

  return embed;
}

export function createErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle('❌ Error')
    .setDescription(message)
    .setTimestamp();
}

export function createSuccessEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle('✅ Success')
    .setDescription(message)
    .setTimestamp();
}

export function createInfoEmbed(title: string, message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(title)
    .setDescription(message)
    .setTimestamp();
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
