import React, { createContext, useContext, useEffect, useState } from 'react';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
  useProgress,
  State,
  Track,
} from 'react-native-track-player';
import { SongTrack, SongSegment } from '@/types/songTypes';
import { fetchSongLyrics, splitAudio } from '@/services/backendApi';
import API_ROUTES from '@/constants/apiRoutes';

interface TrackPlayerContextType {
  isTrackPlayerReady: boolean; // use for interactions with track player
  currentTrack: SongTrack; // use to get info about current song
  songLines: { currentLine: string; previousLine: string; nextLine: string }; // current song lines
  isPlaying: boolean; // use to get info if song is playing
  queueState: SongTrack[];
  // song controls
  toggleSong: () => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  loadSong: (track: SongTrack) => void;
  // expand further if you need more interactions with track player
  // addSongToQueue: (songTrack: SongTrack) => void; // Could be used to check if song is cached, if not it will invoke loadSong
}

const TrackPlayerContext = createContext<TrackPlayerContextType | undefined>(undefined);

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTrackPlayerReady, setIsTrackPlayerReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({} as SongTrack);
  const [songLines, setSongLines] = useState({
    previousSegmentIndex: -1,
    previousLine: '',
    currentLine: '',
    nextLine: '',
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = useProgress();
  const [ queueState, setQueueState ] = useState<SongTrack[]>([]);

  const loadSong = async (track: SongTrack) => {
    if (!isTrackPlayerReady) {
      console.warn('TrackPlayer is not ready yet!');
      return;
    }
    try {
      const youtubeUrl = track.youtubeUrl;
      if (!youtubeUrl) {
        console.warn('No YouTube URL provided for the track.');
        return;
      }
      const fetchedSongText = await fetchSongLyrics(youtubeUrl);
      const fetchedAudioSplitterResponse = await splitAudio(youtubeUrl);
      const songUrl = API_ROUTES.API_BASE_URL + fetchedAudioSplitterResponse.instrumentsPath;

      track.url = songUrl; // provide url of the file location to the track
      track.songText = fetchedSongText; // provide song text to the track

      await TrackPlayer.add(track, null);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error loading song:', error.message);
      }
    }

    setQueueState(await TrackPlayer.getQueue());
  };

  const playNextSong = async () => {
    if (!isTrackPlayerReady) {
      console.warn('TrackPlayer is not ready yet!');
      return;
    }
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.warn('Error skipping to next track:', error);
    }
  };

  const playPreviousSong = async () => {
    if (!isTrackPlayerReady) {
      console.warn('TrackPlayer is not ready yet!');
      return;
    }
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.warn('Error skipping to previous track:', error);
    }
  };

  const toggleSong = async () => {
    if (!isTrackPlayerReady) {
      console.warn('TrackPlayer is not ready yet!');
      return;
    }
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  // Initialize TrackPlayer and update state
  useEffect(() => {
    const initializeTrackPlayer = async () => {
      if (isTrackPlayerReady) return;
      try {
        TrackPlayer.registerPlaybackService(() => require('@/services/service'));
        await TrackPlayer.setupPlayer();
        setIsTrackPlayerReady(true); // Mark TrackPlayer as ready
      } catch (error) {
        console.error('Error initializing TrackPlayer:', error);
      }
    };

    initializeTrackPlayer();
  }, []);

  // update song lines state
  useEffect(() => {
    const songText = currentTrack.songText;
    if (!songText || !songText.segments) return;

    const updateSongLines = () => {
      const currentTime = progress.position;

      // get index of current song segment
      const currentSegmentIndex = songText.segments.findIndex(
        (segment: SongSegment) =>
          currentTime >= segment.start - 0.5 && currentTime < segment.end - 0.5,
      );

      // initial text
      if (currentTime < 0.1 && currentSegmentIndex === -1) {
        setSongLines({
          previousSegmentIndex: -1,
          previousLine: '',
          currentLine: '',
          nextLine: songText.segments[0]?.text,
        });
      // normal case
      } else if (currentSegmentIndex !== -1) {
        setSongLines({
          previousSegmentIndex: currentSegmentIndex,
          previousLine: songText.segments[currentSegmentIndex - 1]?.text || '',
          currentLine: songText.segments[currentSegmentIndex]?.text || '',
          nextLine: songText.segments[currentSegmentIndex + 1]?.text || '',
        });
      // between lines (silence) case
      } else {
        setSongLines({
          previousSegmentIndex: songLines.previousSegmentIndex,
          previousLine: songText.segments[songLines.previousSegmentIndex]?.text || '',
          currentLine: ' ',
          nextLine: songText.segments[songLines.previousSegmentIndex + 1]?.text || '',
        });
      }
    };

    updateSongLines();
  }, [progress.position, currentTrack.songText]);

  // update current track state
  useTrackPlayerEvents(
    [Event.PlaybackActiveTrackChanged, Event.PlaybackPlayWhenReadyChanged],
    async () => {
      const track = await TrackPlayer.getActiveTrack();
      if (track) {
        setCurrentTrack(track as SongTrack);
      } else {
        console.warn('No active track found!');
      }
    },
  );

  // update isPlaying state
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    }
  });

  return (
    <TrackPlayerContext.Provider
      value={{
        isTrackPlayerReady,
        currentTrack,
        songLines,
        isPlaying,
        queueState,
        playNextSong,
        playPreviousSong,
        toggleSong,
        loadSong,
      }}>
      {children}
    </TrackPlayerContext.Provider>
  );
};

export const useTrackPlayer = (): TrackPlayerContextType => {
  const context = useContext(TrackPlayerContext);
  if (!context) {
    throw new Error('useTrackPlayer must be used within a TrackPlayerProvider');
  }
  return context;
};
