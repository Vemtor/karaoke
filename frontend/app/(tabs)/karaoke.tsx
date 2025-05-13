import React from 'react';
import global from '@/styles/global';
import { SafeAreaView } from 'react-native';
import SongViewText from '@/components/karaoke/KaraokeText';
import ControlPanel from '@/components/karaoke/ControlPanel';

const KaraokeScreen = () => {
  return (
    <SafeAreaView style={global['safe-area-container']}>
      <SongViewText />
      <ControlPanel />
    </SafeAreaView>
  );
};

export default KaraokeScreen;
