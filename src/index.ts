export { Music, Playlist, Track } from './Music';
export { APIs, Utils, StringUtils } from './Utils';
import { DeezerAlbum, DeezerPlaylist, SoundCloud, Spotify } from 'play-dl';
import { Music, Playlist, Track } from './Music';

/**
 * Searches for a track or a playlist on youtube
 * @param {string} query: string | url
 * @returns Promise<Track[] | Playlist[]>
 */

export async function youtube(query: string): Promise<Track[] | Playlist[]> {
  return await new Music().youtube(query);
}

/**
 *  Searches for a track, playlist or album on deezer
 * @param {string} query
 * @returns Promise<Track | Playlist | DeezerAlbum | DeezerPlaylist>
 */

export async function deezer(
  query: string
): Promise<Track | Playlist | DeezerAlbum | DeezerPlaylist> {
  return await new Music().deezer(query);
}

/**
 * Searches for a track, playlist or album on Spotify
 * @param {string} query
 * @returns Promise<Spotify>
 */

export async function spotify(query: string): Promise<Spotify> {
  return await new Music().spotify(query);
}

/**
 * Gets a track or a playlist from Soundcloud
 * @param {string} query
 * @returns Promise<SoundCloud>
 */

export async function soundcloud(query: string): Promise<SoundCloud> {
  return await new Music().soundcloud(query);
}
