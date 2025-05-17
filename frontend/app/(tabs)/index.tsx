import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import global from '@/styles/global';

import TileGrid from '@/components/tile-grid';
import SongTile, { SongTileProps } from '@/components/tiles/song-tile';
import PlaylistTile, { PlaylistTileProps } from '@/components/tiles/playlist-tile';
import TileModal from '@/components/modals/tile-modal';
import { mockPlaylists, mockSongs } from '@/components/home/mock-data';
import useSelectedTileStore from '@/stores/selected-tile.store';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
import { TileModalVariant } from '@/components/modals/types/tile-modal.enum';

const HomeScreen = () => {
  const setVisible = useSelectedTileStore((state) => state.setVisible);
  const setVariant = useSelectedTileStore((state) => state.setVariant);
  const setTileData = useSelectedTileStore((state) => state.setTileData);
  const tileData = useSelectedTileStore((state) => state.tileData);

  const [recentSongs, setRecentSongs] = useState<SongTileProps[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<PlaylistTileProps[]>([]);

  const openTileModal = (tile: ImageTileProps, variant: TileModalVariant) => {
    setTileData(tile);
    setVisible(true);
    setVariant(variant);
  };

  useEffect(() => {
    // Fetch recent songs and playlists from the local storage
    // For now, we are using mock data

    const augmentedSongs = mockSongs.map((song) => ({
      ...song,
      onPress: () => openTileModal(song, TileModalVariant.NEW_SONG),
    }));
    setRecentSongs(augmentedSongs);

    const augmentedPlaylists = mockPlaylists.map((playlist) => ({
      ...playlist,
      onPress: () => openTileModal(playlist, TileModalVariant.NEW_PLAYLIST),
    }));
    setRecentPlaylists(augmentedPlaylists);
  });

  return (
    <SafeAreaView style={global['safe-area-container']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>&lt;LOGO SOON&gt;</Text>
        </View>

        <TileGrid<SongTileProps> tiles={recentSongs} tileComponent={SongTile} columns={2} />

        <View style={styles.recentPlaylistsContainer}>
          <Text style={styles.recentPlaylistsText}>Recently played playlists:</Text>
        </View>

        <TileGrid<PlaylistTileProps>
          tiles={recentPlaylists}
          tileComponent={PlaylistTile}
          columns={1}
        />
      </View>

      {tileData && <TileModal />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 13,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.quartz,
    minHeight: 73,
    borderRadius: 8,
  },
  logoText: {
    alignSelf: 'center',
    color: Colors.black,
    ...Typography['font-bold'],
    ...Typography['text-xl'],
  },
  recentPlaylistsContainer: {
    minHeight: 45,
    borderRadius: 8,
    backgroundColor: Colors.quartz,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentPlaylistsText: {
    color: Colors.black,
    ...Typography['font-bold'],
    ...Typography['text-md'],
  },
});

export default HomeScreen;
