import { EmbedBuilder } from 'discord.js';
import { Track } from 'erela.js';
import { QueueTrack } from '../types/QueueTrack';

export function createNowPlayingEmbed(track: QueueTrack): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('✧ Resonating with Cosmic Vibrations')
    .setDescription(`**[${track.title}](${track.uri})**`)
    .addFields(
      { name: 'Divine Creator', value: track.author || 'Unknown', inline: true },
      { name: 'Duration', value: formatDuration(track.duration), inline: true },
      { name: 'Summoned by', value: track.requester.toString(), inline: true }
    )
    .setThumbnail(track.thumbnail || null)
    .setTimestamp();
}

export function createQueueEmbed(queue: QueueTrack[], currentTrack: QueueTrack): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('✧ The Celestial Harmonies Await')
    .setDescription(`**Current Resonance:**\n[${currentTrack.title}](${currentTrack.uri})\n\n**Forthcoming Vibrations:**`)
    .setTimestamp();

  const upNext = queue.slice(0, 10).map((track, index) =>
    `${index + 1}. [${track.title}](${track.uri}) - ${formatDuration(track.duration)}`
  ).join('\n');

  if (upNext) {
    embed.setDescription(
      `**Current Resonance:**\n[${currentTrack.title}](${currentTrack.uri})\n\n**Forthcoming Vibrations:**\n${upNext}`
    );
  }

  if (queue.length > 10) {
    embed.setFooter({ text: `And ${queue.length - 10} more harmonies await...` });
  }

  return embed;
}

export function createErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x8B0000)
    .setTitle('⚠ The Divine Frequencies Falter')
    .setDescription(message)
    .setTimestamp();
}

export function createSuccessEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('✧ Thy Request... is Worthy!')
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
