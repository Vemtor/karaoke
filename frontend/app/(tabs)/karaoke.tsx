import React from 'react';
import { SafeAreaView } from 'react-native';
import SongViewText from '@/components/karaoke/KaraokeText';
import ControlPanel from '@/components/karaoke/ControlPanel';

const KaraokeScreen = () => {
  return (
    <SafeAreaView className="h-full">
      <SongViewText />
      <ControlPanel />
    </SafeAreaView>
  );
};

export default KaraokeScreen;
