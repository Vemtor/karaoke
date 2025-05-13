import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { SkipBack, SkipForward, Play, Pause, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import SongSpinner from './SongSpinner';


export default function ControlPanel() {
  const { currentTrack, playNextSong, isPlaying, playPauseSong, playPreviousSong } = useTrackPlayer();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <View style={styles.container}>
      <View style={[styles.rowContainer]}>
        <Text style={styles.songTitle}>{currentTrack ? currentTrack.title :  "title not provide"}</Text>
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
        <TouchableOpacity style={styles.button} onPress={playPreviousSong}>
          <SkipBack size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={playPauseSong}
        >
          {isPlaying ? <Pause size={32} color="black" /> : <Play size={32} color="black" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={playNextSong}>
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