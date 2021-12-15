import { TrackData } from './Track';

interface PlayList {
  type: string;
  id: string;
  url: string;
  title: string;
  videoCount: number;
  channel: { type: string; name: string; url: string };
  thumbnail: string;
  videos: TrackData[];
}

export class Playlist {
  type: string;
  id: string;
  url: string;
  title: string;
  videoCount: number;
  channel: {};
  thumbnail: string;
  videos: TrackData[];

  constructor(playlist: PlayList) {
    this.type = playlist.type;
    this.id = playlist.id;
    this.url = playlist.url;
    this.title = playlist.title;
    this.videoCount = playlist.videoCount;
    this.channel = playlist.channel;
    this.thumbnail = playlist.thumbnail;
    this.videos = playlist.videos;
  }
}
