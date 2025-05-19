import React from 'react';
import {StyleSheet, SafeAreaView, Dimensions, FlatList} from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import SongTile from '@/components/tiles/song-tile';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { queueState } = useTrackPlayer();

  return (
    <SafeAreaView>
      <FlatList
        contentContainerStyle={styles.listContainerFlatList}
        data={queueState}
        renderItem={({ item }) => <SongTile title={item.title || ''} subtitle={item.artist || 'unkown'} image={item.thumbnailUrl || ''}  />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainerFlatList: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
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
  songTile: {
    marginHorizontal: width * 0.04,
    marginVertical: 10,
  },
  tile: {
    position: 'relative',
    height: 100,
  },
  rectangle: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 80,
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  tileContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  artist: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
