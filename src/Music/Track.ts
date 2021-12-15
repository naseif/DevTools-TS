export interface TrackData {
  durationInSec: number;
  title: string;
  url: string;
  thumbnails?: any[];
  duration: string;
  type: string;
  description?: string;
  views?: number;
  channel?: { name: string; url: string };
  private?: boolean;
  shortTitle?: string;
  rank?: number;
  explicit?: string;
  previewURL?: string;
  artist?: { id: number; name: string; url: string; picture: {} };
  album?: {};
}

export class Track {
  title: string;
  url: string;
  thumbnails?: any[];
  duration: number;
  type: string;
  description?: string;
  views?: number;
  channel?: {};
  private?: boolean;
  shortTitle?: string;
  rank?: number;
  explicit?: string;
  previewURL?: string;
  artist?: { id: number; name: string; url: string; picture: {} };
  album?: {};

  constructor(track: TrackData) {
    if (!track) throw new Error('Constructor was not initialized properly!');
    this.title = track.title;
    this.url = track.url;
    this.thumbnails = track?.thumbnails || undefined;
    this.duration = track?.durationInSec;
    this.type = track.type;
    this.description = track?.description;
    this.views = track?.views;
    this.channel = {
      name: track?.channel?.name,
      url: track?.channel?.url
    };
    this.private = track?.private;
    this.shortTitle = track?.shortTitle;
    this.rank = track?.rank;
    this.explicit = track?.explicit;
    this.previewURL = track?.previewURL;
    this.artist = track?.artist;
    this.album = track?.album;
  }
}
