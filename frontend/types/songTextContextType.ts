import SongText from './SongText';

export default interface SongTextContextType {
    songText: SongText | null;
    setSongText: (songText: SongText) => void;
}