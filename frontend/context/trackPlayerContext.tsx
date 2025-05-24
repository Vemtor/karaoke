import React, { createContext, useContext, useEffect, useState } from 'react';
import TrackPlayer, {
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { SongSegment, SongTrack } from '@/types/songTypes';
import { fetchSongLyrics } from '@/services/backendApi';
import API_ROUTES from '@/constants/apiRoutes';
import { getItem, setItem } from '@/services/storage';

interface TrackPlayerContextType {
  isTrackPlayerReady: boolean; // use for interactions with track player
  currentTrack: SongTrack; // use to get info about current song
  songLines: { currentLine: string; previousLine: string; nextLine: string }; // current song lines
  isPlaying: boolean; // use to get info if song is playing
  // song controls
  isEditing: boolean;
  editedLine: string;
  lineStart: number;
  lineEnd: number;
  toggleSong: () => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  handleEditPress: () => void;
  handleSavePress: () => void;
  loadSong: (track: SongTrack) => void;
  setEditedLine: (text: string) => void;
  handleReset: () => void;
  setLineStart: (start: number) => void;
  setLineEnd: (end: number) => void;
  handleCancelPress: () => void;
  addNewLine: () => void;
  removeLine: () => void;
  // expand further if you need more interactions with track player
  // addSongToQueue: (songTrack: SongTrack) => void; // Could be used to check if song is cached, if not it will invoke loadSong
}

const TrackPlayerContext = createContext<TrackPlayerContextType | undefined>(undefined);

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const TRANSCRIPTIONS = 'transcriptions';
  const [isTrackPlayerReady, setIsTrackPlayerReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({} as SongTrack);
  const [songLines, setSongLines] = useState<{
    previousSegmentIndex: number;
    previousLine: string | null;
    currentLine: string | null;
    nextLine: string | null;
  }>({
    previousSegmentIndex: -1,
    previousLine: null,
    currentLine: null,
    nextLine: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [editedLine, setEditedLine] = useState(songLines.currentLine);
  const [isEditing, setIsEditing] = useState(false);
  const [lineStart, setLineStart] = useState<number | null>(null);
  const [lineEnd, setLineEnd] = useState<number | null>(null);
  const progress = useProgress();

  const handleEditPress = async () => {
    if (isPlaying) {
      toggleSong();
    }
    setIsEditing(true);
  };

  const handleSavePress = async () => {
    if (editedLine != null) {
      if (lineStart === null || isNaN(lineStart)) {
        alert('Please enter a valid start time.');
        return;
      }
      if (lineEnd === null || isNaN(lineEnd)) {
        alert('Please enter a valid end time.');
        return;
      }
      if (lineStart >= lineEnd) {
        alert('Start time must be less than end time.');
        return;
      }
    }

    if (isEditing) {
      saveEditedLine();
    }
  };

  useEffect(() => {
    setEditedLine(songLines.currentLine);
    const segmentIndex = songLines.previousSegmentIndex;
    if (currentTrack.songText?.segments && segmentIndex >= 0 && songLines.currentLine) {
      setLineStart(currentTrack.songText.segments[segmentIndex].start ?? null);
      setLineEnd(currentTrack.songText.segments[segmentIndex].end ?? null);
    } else {
      setLineStart(null);
      setLineEnd(null);
    }
  }, [songLines.currentLine, isEditing]);

  const saveEditedLine = async () => {
    console.log('Saving: ', songLines, editedLine);
    const segmentIndex = songLines.previousSegmentIndex;
    const segments = currentTrack.songText?.segments || [];
    for (let i = 0; i < segments.length; i++) {
      if (i === segmentIndex) continue;

      const seg = segments[i];
      if (
        (lineStart > seg.start && lineStart < seg.end) ||
        (lineEnd > seg.start && lineEnd < seg.end) ||
        (lineStart < seg.start && lineEnd > seg.end)
      ) {
        console.log(segments);
        alert(`The time range overlaps with segment ${i + 1}: "${seg.text}"`);
        return;
      }
    }

    if (currentTrack.songText?.segments && segmentIndex >= 0 && songLines.currentLine) {
      currentTrack.songText.segments[segmentIndex].text = editedLine || '';
      currentTrack.songText.segments[segmentIndex].start = lineStart;
      currentTrack.songText.segments[segmentIndex].end = lineEnd;
    }
    console.log('Saved: ', songLines, editedLine, currentTrack.songText?.segments[segmentIndex]);

    if (currentTrack.youtubeUrl != null) {
      const raw = await getItem(TRANSCRIPTIONS);
      let transcriptionsMap;
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        transcriptionsMap = new Map(Object.entries(parsed));
      } catch (err) {
        console.warn('Failed to parse transcriptions:', err);
        transcriptionsMap = new Map();
      }
      transcriptionsMap.set(currentTrack.youtubeUrl, currentTrack);
      setItem(TRANSCRIPTIONS, JSON.stringify(Object.fromEntries(transcriptionsMap)));
    }
    const raw = await getItem(TRANSCRIPTIONS);
    const parsed = raw ? JSON.parse(raw) : {};
    const transcriptionsMap = new Map(Object.entries(parsed));
    console.log('stored', transcriptionsMap.get(currentTrack.youtubeUrl).songText.segments[0]);
    segments.sort((a, b) => a.start - b.start);
    console.log('segments:', segments);
    setIsEditing(false);
  };

  const getTranscriptions = async (): Promise<Map<string, SongTrack>> => {
    const raw = await getItem(TRANSCRIPTIONS);
    const parsed = raw ? JSON.parse(raw) : {};
    return new Map(Object.entries(parsed));
  };

  const handleCancelPress = async () => {
    setIsEditing(false);
    const transcriptionsMap = await getTranscriptions();
    let storedTrack = null;
    if (currentTrack.youtubeUrl != null) {
      storedTrack = transcriptionsMap.get(currentTrack.youtubeUrl);
    }

    if (storedTrack && storedTrack.songText?.segments) {
      if (currentTrack.songText) {
        currentTrack.songText.segments = [...storedTrack.songText.segments];
      }
    }
    setEditedLine(songLines.currentLine || '');
    setLineStart(currentTrack.songText?.segments[songLines.previousSegmentIndex]?.start ?? null);
    setLineEnd(currentTrack.songText?.segments[songLines.previousSegmentIndex]?.end ?? null);
  };

  const handleReset = async () => {
    const transcriptionsMap = await getTranscriptions();
    if (currentTrack.youtubeUrl != null) {
      transcriptionsMap.delete(currentTrack.youtubeUrl);
      setItem(TRANSCRIPTIONS, JSON.stringify(Object.fromEntries(transcriptionsMap)));
      loadSong(currentTrack);
    }
    setIsEditing(false);
  };

  const addNewLine = async () => {
    const newLine = {
      start: Math.max(progress.position - 1, 0),
      end: progress.position,
      text: '',
    };
    console.log('progress ', progress.position);

    currentTrack.songText?.segments.push(newLine);
    currentTrack.songText?.segments.sort((a, b) => a.start - b.start);
    const newIndex =
      currentTrack.songText?.segments.findIndex((segment) => segment === newLine) || -1;

    setSongLines({
      previousSegmentIndex: newIndex,
      previousLine: currentTrack.songText?.segments[newIndex - 1]?.text || null,
      currentLine: ' ',
      nextLine: currentTrack.songText?.segments[newIndex + 1]?.text || null,
    });
    setEditedLine(' ');
    setLineStart(newLine.start);
    setLineEnd(newLine.end);
  };

  const loadSong = async (track: SongTrack) => {
    // if (!isTrackPlayerReady) {
    //   console.warn('TrackPlayer is not ready yet!');
    //   return;
    // }
    try {
      const raw = await getItem(TRANSCRIPTIONS);
      let transcriptionsMap;
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        transcriptionsMap = new Map(Object.entries(parsed));
      } catch (err) {
        console.warn('Failed to parse transcriptions:', err);
        transcriptionsMap = new Map();
      }

      // if (track.id && songsMap[track.id]?.songText) {
      //   console.log('Loaded edited song from storage');
      //   track.songText = songsMap[track.id].songText;
      // } else {
      //   const fetchedSongText = await fetchSongLyrics(track.youtubeUrl);
      //   console.log('Fetched from API:', fetchedSongText.segments[0]);
      //   track.songText = fetchedSongText;

      // const youtubeUrl = track.youtubeUrl;
      // if (!youtubeUrl) {
      //   console.warn('No YouTube URL provided for the track.');
      //   return;
      // }
      track.youtubeUrl = 'https://www.youtube.com/watch?v=1UUYjd2rjsE';
      const fetchedSongText =
        transcriptionsMap.get(track.youtubeUrl)?.songText ||
        (await fetchSongLyrics(track.youtubeUrl));

      console.log('Fetched!!!: {},', fetchedSongText.segments[0]);
      // const fetchedAudioSplitterResponse = await splitAudio(youtubeUrl);
      const songUrl =
        API_ROUTES.API_BASE_URL + '/api/audio/split/1UUYjd2rjsE/1UUYjd2rjsE_Instruments.mp3';

      track.url = songUrl; // provide url of the file location to the track
      track.songText = fetchedSongText; // provide song text to the track

      await TrackPlayer.add(track, null);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error loading song:', error.message);
      }
    }
  };

  const removeLine = async () => {
    const segmentIndex = songLines.previousSegmentIndex;
    if (segmentIndex < 0 || !currentTrack.songText?.segments) return;

    currentTrack.songText.segments.splice(segmentIndex, 1);

    const segments = currentTrack.songText.segments;
    let newIndex = segmentIndex;
    if (newIndex >= segments.length) newIndex = segments.length - 1;

    setSongLines({
      previousSegmentIndex: newIndex,
      previousLine: segments[newIndex - 1]?.text || null,
      currentLine: segments[newIndex]?.text || null,
      nextLine: segments[newIndex + 1]?.text || null,
    });

    setEditedLine(segments[newIndex]?.text || '');
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
    if (!isEditing) {
      if (state === State.Playing) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }
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
        await loadSong({} as SongTrack);
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
          previousLine: null,
          currentLine: null,
          nextLine: songText.segments[0]?.text,
        });
        // normal case
      } else if (currentSegmentIndex !== -1) {
        setSongLines({
          previousSegmentIndex: currentSegmentIndex,
          previousLine: songText.segments[currentSegmentIndex - 1]?.text || null,
          currentLine: songText.segments[currentSegmentIndex]?.text || null,
          nextLine: songText.segments[currentSegmentIndex + 1]?.text || null,
        });
        // between lines (silence) case
      } else {
        setSongLines({
          previousSegmentIndex: songLines.previousSegmentIndex,
          previousLine: songText.segments[songLines.previousSegmentIndex]?.text || '',
          currentLine: null,
          nextLine: songText.segments[songLines.previousSegmentIndex + 1]?.text || '',
        });
      }
    };

    updateSongLines();
  }, [progress.position, currentTrack.songText, isEditing]);

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
        isEditing,
        editedLine,
        lineStart,
        lineEnd,
        handleEditPress,
        handleSavePress,
        playNextSong,
        playPreviousSong,
        toggleSong,
        loadSong,
        setEditedLine,
        handleReset,
        setLineStart,
        setLineEnd,
        handleCancelPress,
        addNewLine,
        removeLine,
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
