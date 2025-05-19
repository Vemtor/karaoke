import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext'

import ViewLayout from '@/components/wrappers/view-laytout';

const Search = () => {
  const { loadSong } = useTrackPlayer();
  return (
    <ViewLayout>
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-[24px] font-bold font-roboto-mono">Search</Text>
      </View>
    </ViewLayout>
  );
};

export default Search;
