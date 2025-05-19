import { View, Text } from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';

export default function SongViewText() {
  const { songLines } = useTrackPlayer();
  return (
    <View className="w-full h-full flex justify-center items-center bg-[#191414]">
      <View className="relative w-full flex justify-center items-center">
        <Text className="text-[22px] font-roboto-mono text-white text-center my-2 z-0">
          {songLines.previousLine}
        </Text>
        <View className="absolute w-full h-full top-0 left-0 z-1 bg-gradient-to-b from-[rgba(25,20,20,1)] from-[75%_rgba(25,20,20,0.5)] to-[rgba(0,0,0,0)]" />
      </View>
      <Text className="text-[22px] font-roboto-mono text-[#95E558] text-center my-2">
        {songLines.currentLine}
      </Text>
      <View className="relative w-full flex justify-center items-center">
        <Text className="text-[22px] font-roboto-mono text-white text-center my-2 z-0">
          {songLines.nextLine}
        </Text>
        <View className="absolute w-full h-full top-0 left-0 z-1 bg-gradient-to-t from-[rgba(25,20,20,1)] from-[75%_rgba(25,20,20,0.5)] to-[rgba(0,0,0,0)]" />
      </View>
    </View>
  );
};