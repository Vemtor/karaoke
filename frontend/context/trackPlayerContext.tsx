import React, { createContext, useContext, useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import SongManager from '@/services/songManager';
interface TrackPlayerContextType {
  isTrackPlayerReady: boolean;
}

const TrackPlayerContext = createContext<TrackPlayerContextType | undefined>(undefined);

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTrackPlayerReady, setIsTrackPlayerReady] = useState(false);
  useEffect(() => {
    const initializeTrackPlayer = async () => {
      if (isTrackPlayerReady) return;
      try {
        TrackPlayer.registerPlaybackService(() => require('@/services/service'));
        await TrackPlayer.setupPlayer();

        // const track = {
        //   url: require('../assets/song.mp3'), // Load media from the app bundle
        //   title: 'Never Gonna Give You Up',
        //   duration: 272,
        // };

        // await TrackPlayer.add(track);
        setIsTrackPlayerReady(true); // Mark TrackPlayer as ready
        console.log('SongManager initialized successfully!');
      } catch (error) {
        console.error('Error initializing TrackPlayer:', error);
      }
    };

    initializeTrackPlayer();
  }, []);

  return (
    <TrackPlayerContext.Provider value={{ isTrackPlayerReady }}>
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