import { yt_validate, search, playlist_info } from 'play-dl';
import { Track } from './Track';
import { Playlist } from './Playlist';

export class Music {
  /**
   * Searches for a track or a playlist on youtube
   * @param {string} query: string | url
   * @returns Track | Playlist
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
        if (!search) throw new Error('No Song was found for this query!');
        tracks = result.map((track: any) => {
          console.log(track.thumbnails[0].url);
          return new Track(track);
        });
        break;
    }

    return tracks;
  }
}
