import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import usePlaylistStore, { Playlist } from '@/stores/playlist.store';
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';
import colors from '@/constants/colors';
import { useTrackPlayer } from '@/context/trackPlayerContext';

const PlaylistDetailScreen = () => {
  const router = useRouter();
  // const { id } = useLocalSearchParams<{ id: string }>();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id as string;
  const { addSongToQueue, addMultipleSongsToQueue } = useTrackPlayer();

  const { getPlaylistById, removeSongFromPlaylist, deletePlaylist } = usePlaylistStore();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    if (id) {
      const foundPlaylist = getPlaylistById(id);
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
      } else {
        Alert.alert('Error', 'Playlist not found');
        router.back();
      }
    }
  }, [id, getPlaylistById]);

  // Refresh playlist data when returning from other screens
  useFocusEffect(
    useCallback(() => {
      if (id) {
        const foundPlaylist = getPlaylistById(id);
        if (foundPlaylist) {
          setPlaylist(foundPlaylist);
        }
      }
    }, [id, getPlaylistById]),
  );

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) {
      Alert.alert('Info', 'No songs in this playlist');
      return;
    }

    addMultipleSongsToQueue(playlist.songs);
    Alert.alert('Success', `Added ${playlist.songs.length} songs to queue`);
  };

  const handlePlaySong = (song: SearchedVideo) => {
    addSongToQueue(song);
  };

  const handleRemoveSong = (songId: string, songTitle: string) => {
    console.log(songId);
    if (!playlist) return;

    console.log(playlist.id);
    console.log(songTitle);
    Alert.alert('Remove Song', `Remove "${songTitle}" from the playlist?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          // The key fix: pass the correct playlist ID and song ID
          removeSongFromPlaylist(playlist.id, songId);

          // Refresh the playlist data after removal
          const updatedPlaylist = getPlaylistById(playlist.id);
          console.log(playlist.id);
          if (updatedPlaylist) {
            setPlaylist(updatedPlaylist);
          }

          Alert.alert('Success', 'Song removed from playlist');
        },
      },
    ]);
  };

  const handleEditPlaylist = () => {
    if (playlist) {
      router.push(`/playlist/edit/${playlist.id}`);
    }
  };

  const handleDeletePlaylist = () => {
    if (!playlist) return;

    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePlaylist(playlist.id);
            router.back();
          },
        },
      ],
    );
  };

  const renderSongItem = ({ item, index }: { item: SearchedVideo; index: number }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handlePlaySong(item)}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.songThumbnail} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.songChannel} numberOfLines={1}>
          {item.channelTitle}
        </Text>
        <Text style={styles.songDuration}>{item.formattedDuration}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveSong(item.id, item.title)}>
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {playlist.name}
        </Text>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={handleEditPlaylist} style={{ marginRight: 16 }}>
            <Ionicons name="create-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeletePlaylist}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Playlist Info */}
      <View style={styles.playlistInfo}>
        <Image
          source={{ uri: playlist.image || 'https://via.placeholder.com/120' }}
          style={styles.playlistImage}
        />

        <View style={styles.playlistDetails}>
          <Text style={styles.playlistName}>{playlist.name}</Text>
          {playlist.description && (
            <Text style={styles.playlistDescription}>{playlist.description}</Text>
          )}
          <Text style={styles.playlistStats}>
            {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayAll}>
          <Ionicons name="play" size={20} color="white" />
          <Text style={styles.playButtonText}>Play All</Text>
        </TouchableOpacity>
      </View>

      {/* Songs List */}
      <View style={styles.songsContainer}>
        <Text style={styles.songsHeader}>Songs</Text>

        {playlist.songs.length > 0 ? (
          <FlatList
            data={playlist.songs}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.songsList}
          />
        ) : (
          <View style={styles.emptySongs}>
            <Text style={styles.emptySongsText}>No songs in this playlist</Text>
            <Text style={styles.emptySongsSubtext}>
              Search for songs and add them to this playlist
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptySongs: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptySongsSubtext: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  emptySongsText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.listItemBackground,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 18,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: colors.activityIndicator,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  playlistDescription: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  playlistDetails: {
    flex: 1,
  },
  playlistImage: {
    backgroundColor: '#555',
    borderRadius: 8,
    height: 100,
    marginRight: 16,
    width: 100,
  },
  playlistInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  playlistName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistStats: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.6,
  },
  removeButton: {
    padding: 8,
  },
  songChannel: {
    color: colors.text,
    fontSize: 12,
    marginBottom: 2,
    opacity: 0.7,
  },
  songDuration: {
    color: colors.durationText,
    fontSize: 12,
  },
  songInfo: {
    flex: 1,
  },
  songItem: {
    alignItems: 'center',
    backgroundColor: colors.listItemBackground,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 12,
  },
  songThumbnail: {
    backgroundColor: '#555',
    borderRadius: 6,
    height: 60,
    marginRight: 12,
    width: 60,
  },
  songTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  songsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songsHeader: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  songsList: {
    paddingBottom: 20,
  },
});

export default PlaylistDetailScreen;
