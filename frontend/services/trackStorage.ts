import RNFS from 'react-native-fs';
import { SongTrack } from '@/types/songTypes';
import { getItem } from '@/services/storage';

const TRANSCRIPTIONS = 'transcriptions';

export class TrackStorage {
  static async saveTrack(track: SongTrack): Promise<void> {
    if (!track.uuid || !track.url) return;

    const localSongPath = await this.downloadAndSaveSong(track.url, track.uuid.toString());
    if (!localSongPath) {
      console.error('Failed to download and save file for track:', track);
      return;
    }

    const localSongTrack = JSON.parse(JSON.stringify(track));
    localSongTrack.songText = undefined;
    localSongTrack.url = localSongPath;

    const tracksDir = `${RNFS.DocumentDirectoryPath}/tracks`;
    try {
      if (!(await RNFS.exists(tracksDir))) {
        await RNFS.mkdir(tracksDir);
      }
      const filePath = `${tracksDir}/${localSongTrack.uuid}.json`;
      await RNFS.writeFile(filePath, JSON.stringify(localSongTrack), 'utf8');
      console.log('Track saved:', filePath);
    } catch (error) {
      console.error('Error saving SongTrack object:', error);
    }
  }

  private static async downloadAndSaveSong(remoteUrl: string, fileName: string): Promise<string | null> {
    const songsDir = `${RNFS.DocumentDirectoryPath}/songs`;
    try {
      if (!(await RNFS.exists(songsDir))) {
        await RNFS.mkdir(songsDir);
      }
      const localPath = `${songsDir}/${fileName}`;
      const downloadResult = await RNFS.downloadFile({
        fromUrl: remoteUrl,
        toFile: localPath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        return 'file://' + localPath;
      } else {
        console.error('File download error');
        return null;
      }
    } catch (error) {
      console.error('Error downloading and saving file:', error);
      return null;
    }
  }

  static async getAllSavedTracks(): Promise<SongTrack[]> {
    const tracksDir = `${RNFS.DocumentDirectoryPath}/tracks`;
    let transcriptionsMap: Map<string, any> = new Map();

    try {
      const raw = await getItem(TRANSCRIPTIONS);
      const parsed = raw ? JSON.parse(raw) : {};
      transcriptionsMap = new Map(Object.entries(parsed));
    } catch (err) {
      console.warn('Failed to parse transcriptions:', err);
    }

    try {
      if (!(await RNFS.exists(tracksDir))) {
        return [];
      }
      const files = await RNFS.readDir(tracksDir);
      const tracks: SongTrack[] = [];
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.json')) {
          try {
            const content = await RNFS.readFile(file.path, 'utf8');
            const track: SongTrack = JSON.parse(content);

            if (track.youtubeUrl != null) {
              const transcription = transcriptionsMap.get(track.youtubeUrl);

              if (transcription?.songText) {
                track.songText = transcription.songText;
              }

              tracks.push(track);
            }
          } catch (err) {
            console.error('Error reading SongTrack file:', file.path, err);
          }
        }
      }
      return tracks;
    } catch (error) {
      console.error('Error loading files from tracks:', error);
      return [];
    }
  }
}