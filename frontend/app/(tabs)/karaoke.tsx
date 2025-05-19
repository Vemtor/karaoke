import React from 'react';
import ViewLayout from '@/components/wrappers/view-laytout';
import SongViewText from '@/components/karaoke/KaraokeText';
import ControlPanel from '@/components/karaoke/ControlPanel';


const KaraokeScreen = () => {
  return (
    <ViewLayout>
      <SongViewText />
      <ControlPanel />
    </ViewLayout>
  );
};

export default KaraokeScreen;
