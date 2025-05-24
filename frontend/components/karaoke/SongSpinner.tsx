import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';

export default function SongSpinner() {
  const progress = useProgress();
  const [barWidth, setBarWidth] = useState(0);

  const onLayout = (event) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const onSeek = (event) => {
    if (!barWidth) return;
    const pressX = event.nativeEvent.layerX; // absolute x on screen
    const seekRatio = Math.min(Math.max(pressX / barWidth, 0), 1);
    const seekPosition = seekRatio * progress.duration;
    TrackPlayer.seekTo(seekPosition);
  };
  return (
    <>
      <View>
        <Text>
          Elapsed Time: {Math.floor(progress.position)}/{Math.floor(progress.duration)}s
        </Text>
        <TouchableOpacity
          onPress={onSeek}
          onLayout={onLayout}
          style={{
            height: 10,
            width: 300,
            backgroundColor: '#e0e0e0',
            borderRadius: 5,
            overflow: 'hidden',
          }}>
          <View
            style={{
              height: '100%',
              width: `${(progress.duration > 0 ? progress.position / progress.duration : 0) * 100}%`,
              backgroundColor: '#3b5998',
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
