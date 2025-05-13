import SongText from "./songText";
import { Track } from 'react-native-track-player'

export default interface SongTrack extends Track {
    songText?: SongText;
    youtubeUrl?: string;
    thumbnailUrl?: string;
}