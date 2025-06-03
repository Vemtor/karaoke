import React, { useCallback } from 'react';
import { StyleSheet, Dimensions, FlatList, View, Text } from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import ViewLayout from '@/components/wrappers/view-laytout';
import TileModal from '@/components/modals/tile-modal';
import { TileModalVariant } from '@/components/modals/types/tile-modal.enum';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
import useSelectedTileStore from '@/stores/selected-tile.store';
import SongTileBig from '@/components/tiles/song-tile-big';
import { SongTrack } from '@/types/songTypes';

const { width } = Dimensions.get('window');

const DEFAULT_QUEUE_IMAGE = `data:image/svg+xml;base64,${btoa(`
  <svg width="130" height="78" viewBox="0 0 130 78" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="130" height="78" fill="#333333"/>
    <path d="M65 25L75 40H55L65 25Z" fill="#666666"/>
  </svg>
`)}`;

const QueueScreen = () => {
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

  const keyExtractor = useCallback((item: SongTrack, index: number) => {
    // Use a combination of song ID and index to ensure uniqueness
    const songId = item.id || item.title || 'unknown';
    return `${songId}-${index}`;
  }, []);

  const renderQueueItem = useCallback(
    ({ item, index }: { item: SongTrack; index: number }) => (
      <View className="py-1">
        <SongTileBig
          id={`${item.id || item.title || 'unknown'}-${index}`} // Ensure unique ID
          title={item.title || 'Unknown Title'}
          subtitle={item.artist || 'Unknown Artist'}
          image={item.thumbnailUrl || DEFAULT_QUEUE_IMAGE}
          onPress={() =>
            openTileModal(
              {
                id: `${item.id || item.title || 'unknown'}-${index}`,
                title: item.title || 'Unknown Title',
                subtitle: item.artist || 'Unknown Artist',
                image: item.thumbnailUrl || DEFAULT_QUEUE_IMAGE,
              },
              TileModalVariant.QUEUED_SONG,
              item,
            )
          }
        />
      </View>
    ),
    [openTileModal],
  );

  return (
    <ViewLayout>
      {queueState.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainerFlatList}
          data={queueState}
          renderItem={renderQueueItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          // Add these props to improve performance and prevent duplicates
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          // Ensure data is properly handled
          extraData={queueState.length}
        />
      ) : (
        <View className="relative top-[50%] -translate-y-1/2">
          <Text className="text-white text-[24px] font-bold font-roboto-mono text-center">
            Queue is empty...
          </Text>
          <Text className="text-gray-400 text-[16px] font-roboto-mono text-center mt-2">
            Search for songs to add them to your queue
          </Text>
        </View>
      )}

      {tileData && <TileModal />}
    </ViewLayout>
  );
};

const styles = StyleSheet.create({
  artist: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    borderRadius: 5,
    height: '100%',
    resizeMode: 'cover',
    width: 80,
  },
  listContainerFlatList: {
    marginTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  rectangle: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  songTile: {
    marginHorizontal: width * 0.04,
    marginVertical: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tile: {
    height: 100,
    position: 'relative',
  },
  tileContent: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 20,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
});

export default QueueScreen;
