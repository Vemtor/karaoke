import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import React from 'react';
import global from '@/styles/global';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import TileGrid from '@/components/home/tile-grid';
import { mockPlaylists, mockSongs } from '@/components/home/mock-data';
import SongTile from '@/components/tiles/song-tile';
import PlaylistTile from '@/components/tiles/playlist-tile';

const HomeScreen = () => {
  return (
    <SafeAreaView style={global['safe-area-container']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>&lt;LOGO SOON&gt;</Text>
        </View>
        <TileGrid tiles={mockSongs} tileComponent={SongTile} columns={2} />
        <View style={styles.recentPlaylistsContianer}>
          <Text style={styles.recentPlaylistsText}>Recently played playlists:</Text>
        </View>
        <TileGrid tiles={mockPlaylists} tileComponent={PlaylistTile} columns={1} />
      </View>
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
