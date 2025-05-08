import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import global from '@/styles/global';

import TileGrid from '@/components/tile-grid';
import SongTile, { SongTileProps } from '@/components/tiles/song-tile';
import PlaylistTile, { PlaylistTileProps } from '@/components/tiles/playlist-tile';
import ModalMenuPopup from '@/components/modal-menu-popup';
import { mockPlaylists, mockSongs } from '@/components/home/mock-data';

import {
  handleRemoveFromQueue,
  handleAddToQueue,
  handleAddToPlaylist,
  handlePlayPlaylist,
  handleEditPlaylist,
  handleDownloadPlaylist,
} from '@/utils/modal-handlers';

type TileData = (SongTileProps & { type: 'song' }) | (PlaylistTileProps & { type: 'playlist' });

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  const openTileModal = (tile: TileData) => {
    setSelectedTile(tile);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTile(null);
  };

  const songTiles: SongTileProps[] = mockSongs.map((song) => ({
    ...song,
    onPress: () => openTileModal({ ...song, type: 'song', isQueued: song.isQueued }),
  }));

  const playlistTiles: PlaylistTileProps[] = mockPlaylists.map((playlist) => ({
    ...playlist,
    onPress: () => openTileModal({ ...playlist, type: 'playlist' }),
  }));

  return (
    <SafeAreaView style={global['safe-area-container']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>&lt;LOGO SOON&gt;</Text>
        </View>

        <TileGrid<SongTileProps> tiles={songTiles} tileComponent={SongTile} columns={2} />

        <View style={styles.recentPlaylistsContianer}>
          <Text style={styles.recentPlaylistsText}>Recently played playlists:</Text>
        </View>

        <TileGrid<PlaylistTileProps>
          tiles={playlistTiles}
          tileComponent={PlaylistTile}
          columns={1}
        />
      </View>

      {selectedTile && (
        <ModalMenuPopup
          visible={modalVisible}
          onClose={closeModal}
          variant={selectedTile.type}
          title={selectedTile.title}
          subtitle={
            selectedTile.type === 'playlist'
              ? `${selectedTile.subtitle} songs`
              : selectedTile.subtitle
          }
          image={selectedTile.image}
          actions={
            selectedTile.type === 'song'
              ? [
                  {
                    label: selectedTile.isQueued ? 'Remove from queue' : 'Add to queue',
                    onPress: selectedTile.isQueued ? handleRemoveFromQueue : handleAddToQueue,
                    type: selectedTile.isQueued ? 'danger' : 'success',
                  },
                  {
                    label: 'Add to playlist',
                    onPress: handleAddToPlaylist,
                  },
                ]
              : [
                  { label: 'Play playlist', onPress: handlePlayPlaylist },
                  { label: 'Edit playlist', onPress: handleEditPlaylist },
                  { label: 'Download playlist', onPress: handleDownloadPlaylist },
                ]
          }
        />
      )}
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
  recentPlaylistsContianer: {
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
