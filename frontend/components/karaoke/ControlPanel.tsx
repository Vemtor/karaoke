import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { SkipBack, SkipForward, Play, Pause, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import TrackPlayer, { State, Event } from 'react-native-track-player';
import SongSpinner from './SongSpinner';

interface ControlPanelProps {
  onNext: () => void;
  onPrevious: () => void;
  title: string;
}

export default function ControlPanel({ onNext, onPrevious, title }: ControlPanelProps) {
  const { isTrackPlayerReady } = useTrackPlayer(); // Use TrackPlayerContext to check readiness
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Tracks whether the song is playing
  const animation = useRef(new Animated.Value(0)).current;

  const togglePanel = () => {
    setIsOpen(!isOpen);
    Animated.timing(animation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // Adjust the height range as needed
  });

  // Update `isPlaying` based on the TrackPlayer state
  useEffect(() => {
    if (!isTrackPlayerReady) return; // Ensure TrackPlayer is ready before interacting

    const updatePlaybackState = async () => {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    };

    // Listen for playback state changes
    const subscription = TrackPlayer.addEventListener(Event.PlaybackState, async () => {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    });

    // Initial state check
    updatePlaybackState();

    return () => {
      subscription.remove(); // Clean up the event listener
    };
  }, [isTrackPlayerReady]);

  const handlePlayPause = async () => {
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

  return (
    <View style={styles.container}>
      <View style={[styles.rowContainer]}>
        <Text style={styles.songTitle}>{title}</Text>
        <TouchableOpacity style={styles.button} onPress={togglePanel}>
          {isOpen ? <ChevronDown /> : <ChevronUp />}
        </TouchableOpacity>
      </View>
      <Animated.View
        id="additionalControls"
        style={{
          height: animatedHeight,
          overflow: 'hidden',
        }}>
        <SongSpinner />
        <View style={styles.rowContainer}>
          <Text>Vocal Volume</Text>
          <Text>VocalSpinner</Text>
        </View>
      </Animated.View>
      <View style={styles.songControlContainer}>
        <TouchableOpacity style={styles.button} onPress={onPrevious}>
          <SkipBack size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            handlePlayPause();
          }}
        >
          {isPlaying ? <Pause size={32} color="black" /> : <Play size={32} color="black" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <SkipForward size={32} color="black" />
        </TouchableOpacity>
      </View>
      </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#aaa',
    justifyContent: 'space-around',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  button: {
    alignItems: 'center',
  },
  songControlContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  songTitle: {},
  rowContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});