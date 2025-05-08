import SongSegment from './SongSegment';

export default interface SongText {
    full_text: string;
    segments: SongSegment[];
}
