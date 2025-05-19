import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import SongSpinner from '@/components/karaoke/SongSpinner';
import Controls from '@/components/karaoke/Controls';

export default function ControlPanel() {
  const { currentTrack } = useTrackPlayer();
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
    <View className="bg-gray-300 py-2 border-t border-gray-400 justify-around items-center flex flex-col absolute w-full bottom-0">
      <View className="px-3 w-full flex flex-row justify-between items-center">
        <Text className="text-base font-roboto-mono truncate">
          {currentTrack ? currentTrack.title : ' '}
        </Text>
        <TouchableOpacity className="items-center" onPress={togglePanel}>
          {isOpen ? <ChevronDown /> : <ChevronUp />}
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          height: animatedHeight,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <View className="w-full items-center justify-around flex flex-col h-full">
          <View className='w-full h-[1px] my-0 bg-gray-600'/>
          <SongSpinner />
          <View className="px-3 w-full flex flex-row justify-around">
            <Text>Vocal Volume</Text>
            <Text>VocalSpinner</Text>
          </View>
        </View>
      </Animated.View>
      <View className='w-full h-[1px] my-2 bg-gray-600'/>
      <Controls />
    </View>
  );
};