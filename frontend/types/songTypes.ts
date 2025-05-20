import { Track } from 'react-native-track-player';

export interface SongSegment {
  end: number;
  start: number;
  text: string;
}

export interface SongText {
  full_text: string;
  segments: SongSegment[];
}

export interface SongTrack extends Track {
  songText?: SongText;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  uuid?: symbol;
  addToQueue?: () => void;
}