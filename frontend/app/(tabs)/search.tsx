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
        <TouchableOpacity onPress={() => loadSong({title: "On melancholy hill", url: "",youtubeUrl: "https://www.youtube.com/watch?v=BGn2oo-0Dqc", duration: 208})}>
          <Text className="text-white text-[24px] font-bold font-roboto-mono">On Melancholy Hill</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => loadSong({title: "Linkin Park", url: "",youtubeUrl: "https://www.youtube.com/watch?v=eVTXPUF4Oz4", duration: 278})}>
          <Text className="text-white text-[24px] font-bold font-roboto-mono">Linkin Park</Text>
        </TouchableOpacity>
      </View>
    </ViewLayout>
  );
};

export default Search;
