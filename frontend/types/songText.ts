import SongSegment from '@/types/songSegment';

export default interface SongText {
  full_text: string;
  segments: SongSegment[];
}
