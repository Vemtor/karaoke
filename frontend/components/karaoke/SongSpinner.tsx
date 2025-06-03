import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';
import TrackPlayer from 'react-native-track-player'; 
import { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import colors from '@/constants/colors';

export default function SongSpinner() {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const progress = useProgress(50);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  const position = isSeeking ? seekPosition : progress.position;

  const handleSlidingStart = () => {
    setIsSeeking(true);
    setSeekPosition(progress.position);
  }

  const handleValueChange = (value: number) => {
    setSeekPosition(value);
  }

  const handleSlidingComplete = async (value: number) => {
    await TrackPlayer.seekTo(value);
    setSeekPosition(value);
    setIsSeeking(false);
  }

  return (
    <View className="w-full flex flex-col items-center justify-center">
      <Slider style={{ width: '90%', height: 40 }}
        minimumValue={0}
        maximumValue={progress.duration}
        value={position}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={colors.background}
        maximumTrackTintColor={colors['slate-gray']}
        thumbTintColor={colors.background}
      />
      <Text className='text-base font-roboto-mono truncate'>
        {formatTime(position)} / {formatTime(progress.duration)}
      </Text>
    </View>
  );
}