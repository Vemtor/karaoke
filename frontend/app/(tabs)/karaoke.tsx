import React from 'react';
import global from '@/styles/global';
import { StyleSheet, SafeAreaView, TextInput, Button } from 'react-native';
import SongViewText from '@/components/karaoke/KaraokeText';
import ControlPanel from '@/components/karaoke/ControlPanel';
import { useSongManager } from '@/context/songManagerContext';

const KaraokeScreen = () => {
  const [songUrl, setSongUrl] = React.useState('');
  const { setUrl } = useSongManager();
  return (
    <SafeAreaView style={global['safe-area-container']}>
      <TextInput style={styles.text}
      id="songUrlInput"
      onChangeText={(text) => setSongUrl(text)}
      value={songUrl}
      placeholder="Enter song URL"
      />
      <Button
      title={'Play song!'}
      onPress={() => setUrl(songUrl)}
      />
      <SongViewText />
      <ControlPanel
      onNext={() => console.log("Next")}
      onPrevious={() => console.log("Previous")}
      title={"Never Gonna Give You Up"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default KaraokeScreen;
