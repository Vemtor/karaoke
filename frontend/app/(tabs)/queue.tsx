import React, { useCallback } from 'react';
import {StyleSheet, Dimensions, FlatList, View, Text} from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import PlaylistTile from '@/components/tiles/playlist-tile';
import ViewLayout from '@/components/wrappers/view-laytout';
import TileModal from '@/components/modals/tile-modal';
import { TileModalVariant } from '@/components/modals/types/tile-modal.enum';
import TileGrid from '@/components/tile-grid';
import SongTile, { SongTileProps } from '@/components/tiles/song-tile-small';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
import useSelectedTileStore from '@/stores/selected-tile.store';
import SongTileBig from '@/components/tiles/song-tile-big';
import { SongTrack } from '@/types/songTypes';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { queueState } = useTrackPlayer();
  const setVisible = useSelectedTileStore((state) => state.setVisible);
  const setVariant = useSelectedTileStore((state) => state.setVariant);
  const setTileData = useSelectedTileStore((state) => state.setTileData);
  const setSongTrack = useSelectedTileStore((state) => state.setSongTrack);
  const tileData = useSelectedTileStore((state) => state.tileData);
  const openTileModal = useCallback(
      (tile: ImageTileProps, variant: TileModalVariant, songTrack: SongTrack) => {
        setTileData(tile);
        setVisible(true);
        setVariant(variant);
        setSongTrack(songTrack);
      },
      [setTileData, setVisible, setVariant, setSongTrack],
    );
  return (
    <ViewLayout>

      {
      !(queueState.length === 0) ? 
      <FlatList
        contentContainerStyle={styles.listContainerFlatList}
        data={queueState}
        renderItem={({ item }) => 
          <View className='py-1'>
            <SongTileBig
              title={item.title || 'unknown'}
              subtitle={item.artist || 'unknown'}
              image={item.thumbnailUrl || ''}
              onPress={() => openTileModal({title: item.title || 'unknown', subtitle: item.artist || 'unknown' , image: item.thumbnailUrl || ''}, TileModalVariant.QUEUED_SONG, item)}
            />
          </View>
        }
        keyExtractor={(_, index) => index.toString()}
      />
      :
      <View className='relative top-[50%] -translate-y-1/2'>
        <Text className='text-white text-[24px] font-bold font-roboto-mono text-center'>Queue is empty...</Text>
      </View>
      }
    </ViewLayout>
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
