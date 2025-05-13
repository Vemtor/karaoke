import React, { createContext, use, useContext, useEffect, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents, useProgress, State } from 'react-native-track-player';
import SongTrack from '@/types/songTrack';
import { SearchedVideo } from '@/types/searchedVideo';
import { fetchSongLyrics, splitAudio } from '@/services/backendApi';

interface TrackPlayerContextType {
  isTrackPlayerReady: boolean;
  currentTrack: SongTrack;
  songLines: {currentLine: string; previousLine: string; nextLine: string};
  isPlaying: boolean;
  playPauseSong: () => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  loadSong: (songItem: SearchedVideo) => void;
  // addSongToQueue: (songTrack: SongTrack) => void; // Could be used to check if song is cached, if not it will invoke loadSong
}

const TrackPlayerContext = createContext<TrackPlayerContextType | undefined>(undefined);

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTrackPlayerReady, setIsTrackPlayerReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({} as SongTrack);
  const [songLines, setSongLines] = useState({
    previousSegmentIndex: -1,
    previousLine: "",
    currentLine: "",
    nextLine: ""
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = useProgress();

  const loadSong = async (songItem: SearchedVideo) => {
            try {
                const youtubeUrl = songItem.videoUrl;
                console.log('Loading song from URL:', youtubeUrl);
                const fetchedSongText = await fetchSongLyrics(youtubeUrl);

                console.log('Fetched song text:', fetchedSongText);

                const fetchedAudioSplitterResponse = await splitAudio(youtubeUrl);
                console.log('Fetched audio splitter response:', fetchedAudioSplitterResponse);

                const songUrl = 'http://localhost:8080' + fetchedAudioSplitterResponse.instrumentsPath;
                console.log('Song URL:', songUrl);

                const track = {
                    url: songUrl,
                    title: songItem.title,
                    duration: Number(songItem.formattedDuration),
                    songText: fetchedSongText
                };

                if (isTrackPlayerReady) {
                    await TrackPlayer.add(track, null);
                    console.log('Track added to TrackPlayer:', track);
                } else {
                    console.warn('TrackPlayer is not ready yet!');
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error loading song:', error.message);
                }
            }
  };

  const playNextSong = () => {
    if (!isTrackPlayerReady) {
      console.warn('TrackPlayer is not ready yet!');
      return;
    }
    try {
      TrackPlayer.skipToNext();
    } catch (error) {
      console.warn('Error skipping to next track:', error);
    }
  };

  const playPreviousSong = () => {
    if (!isTrackPlayerReady) {
      console.warn('TrackPlayer is not ready yet!');
      return;
    }
    try {
      TrackPlayer.skipToPrevious();
    } catch (error) {
      console.warn('Error skipping to previous track:', error);
    }
  }

  const playPauseSong = async () => {
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
  }

  // Initialize TrackPlayer and update state
  useEffect(() => {
    const initializeTrackPlayer = async () => {
      if (isTrackPlayerReady) return;
      try {
        TrackPlayer.registerPlaybackService(() => require('@/services/service'));
        await TrackPlayer.setupPlayer();
        setIsTrackPlayerReady(true); // Mark TrackPlayer as ready
        console.log('SongManager initialized successfully!');
      } catch (error) {
        console.error('Error initializing TrackPlayer:', error);
      }
    };

    initializeTrackPlayer();
  }, []);

  // update song lines state
  useEffect(() => {
    let songText = currentTrack.songText;
    if (!songText || !songText.segments) return;

    const updateSongLines = () => {
      const currentTime = progress.position;
      
      const currentSegmentIndex = songText.segments.findIndex(
        (segment) => currentTime >= segment.start - 0.5 && currentTime < segment.end - 0.5
      );
      
      if (currentTime < 0.1 && currentSegmentIndex === -1) {
        setSongLines({
          previousSegmentIndex: -1,
          previousLine: "",
          currentLine: "",
          nextLine: songText.segments[0]?.text,
        });
      }
      else if (currentSegmentIndex !== -1) {
        setSongLines({
          previousSegmentIndex: currentSegmentIndex,
          previousLine: songText.segments[currentSegmentIndex - 1]?.text || "",
          currentLine: songText.segments[currentSegmentIndex]?.text || "",
          nextLine: songText.segments[currentSegmentIndex + 1]?.text || "",
        });
      }
      else {
        setSongLines({
          previousSegmentIndex: songLines.previousSegmentIndex,
          previousLine: songText.segments[songLines.previousSegmentIndex]?.text || "",
          currentLine: " ",
          nextLine: songText.segments[songLines.previousSegmentIndex + 1]?.text || "",
        });
      }
    };

    updateSongLines();
  }, [progress.position, currentTrack.songText]);

  // update current track state
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged, Event.PlaybackPlayWhenReadyChanged], async () => {
    const track = await TrackPlayer.getActiveTrack();
    if (track) {
      setCurrentTrack(track as SongTrack);
    } else {
      console.warn('No active track found!');
    }
  });

  // update isPlaying state
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    }
  });

  return (
    <TrackPlayerContext.Provider value={
      { 
        isTrackPlayerReady,
        currentTrack,
        songLines,
        isPlaying,
        playNextSong,
        playPreviousSong,
        playPauseSong,
        loadSong 
      }}
    >
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