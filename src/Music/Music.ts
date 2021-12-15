import {
  yt_validate,
  search,
  playlist_info,
  deezer,
  spotify,
  sp_validate,
  dz_validate,
  Spotify,
  DeezerAlbum,
  DeezerPlaylist,
  SoundCloud,
  so_validate,
  soundcloud
} from 'play-dl';
import { Track } from './Track';
import { Playlist } from './Playlist';

export class Music {
  /**
   * Searches for a track or a playlist on youtube
   * @param {string} query: string | url
   * @returns Promise<Track[] | Playlist[]>
   */

  async youtube(query: string): Promise<Track[] | Playlist[]> {
    if (!query) throw new Error('No search query was provided!');
    const validate = yt_validate(query);
    if (!validate) throw new Error('This is not a valid search query!');

    let tracks;
    let result: any;
    console.log(validate);
    switch (validate) {
      case 'video':
        result = await search(query);
        if (!result) throw new Error('This Track was not found!');
        tracks = result.map((track: any) => {
          console.log(track);
          return new Track(track);
        });
        break;
      case 'playlist':
        const playlist = await playlist_info(query);
        if (!playlist) throw new Error('Playlist not found!');
        tracks = playlist.videos.map((track: any) => {
          return new Playlist(track);
        });
        break;
      case 'search':
        result = await search(query);
        if (!result) throw new Error('No Song was found for this query!');
        tracks = result.map((track: any) => {
          console.log(track.thumbnails[0].url);
          return new Track(track);
        });
        break;
    }

    return tracks;
  }

  /**
   *  Searches for a track, playlist or album on deezer
   * @param {string} query
   * @returns Promise<Track | Playlist | DeezerAlbum | DeezerPlaylist>
   */
  async deezer(
    query: string
  ): Promise<Track | Playlist | DeezerAlbum | DeezerPlaylist> {
    if (!query) throw new Error('No search query was provided!');
    const validate = await dz_validate(query);
    if (!validate) throw new Error('This is not a valid search query!');
    let tracks;
    let result: any;
    switch (validate) {
      case 'search':
        result = await search(query, { source: { deezer: 'track' } });
        tracks = result.map((track: any) => {
          return new Track(track);
        });
        break;
      case 'playlist':
        result = await deezer(query);
        tracks = result;
        break;
      case 'track':
        result = await search(query, { source: { deezer: 'track' } });
        tracks = result.map((track: any) => {
          return new Track(track);
        });
        break;
      case 'album':
        result = await deezer(query);
        tracks = result;
        break;
    }
    return tracks;
  }

  /**
   * Searches for a track, playlist or album on Spotify
   * @param {string} query
   * @returns Promise<Spotify>
   */

  async spotify(query: string): Promise<Spotify> {
    if (!query) throw new Error('No search query was provided!');
    const validate = sp_validate(query);
    if (!validate) throw new Error('This is not a valid search query!');

    return await spotify(query);
  }

  /**
   * Gets a track or a playlist from Soundcloud
   * @param {string} query
   * @returns Promise<SoundCloud>
   */
  async soundcloud(query: string): Promise<SoundCloud> {
    if (!query) throw new Error('No search query was provided!');
    const validate = so_validate(query);
    if (!validate) throw new Error('This is not a valid search query!');

    return await soundcloud(query);
  }
}
