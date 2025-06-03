import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import usePlaylistStore, { Playlist } from '@/stores/playlist.store';
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';
import colors from '@/constants/colors';
import { useTrackPlayer } from '@/context/trackPlayerContext';

const PlaylistEditScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
    reorderSongsInPlaylist,
  } = usePlaylistStore();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPlaylist = getPlaylistById(id);
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
        setPlaylistName(foundPlaylist.name);
        setPlaylistDescription(foundPlaylist.description);
      } else {
        Alert.alert('Error', 'Playlist not found');
        router.back();
      }
    }
  }, [id, getPlaylistById]);

  const handleSave = () => {
    if (!playlist || !playlistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    updatePlaylist(playlist.id, {
      name: playlistName.trim(),
      description: playlistDescription.trim(),
    });

    setIsEditing(false);
    Alert.alert('Success', 'Playlist updated successfully');
  };

  const handleDelete = () => {
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

  const handleRemoveSong = (songId: string) => {
    if (!playlist) return;

    Alert.alert('Remove Song', 'Remove this song from the playlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeSongFromPlaylist(playlist.id, songId);
          // Update local state
          const updatedPlaylist = getPlaylistById(playlist.id);
          if (updatedPlaylist) {
            setPlaylist(updatedPlaylist);
          }
        },
      },
    ]);
  };

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) {
      Alert.alert('Info', 'No songs in this playlist');
      return;
    }

    // addMultipleSongsToQueue(playlist.songs);
    Alert.alert('Success', `Added ${playlist.songs.length} songs to queue`);
  };

  const renderSongItem = ({ item, index }: { item: SearchedVideo; index: number }) => (
    <View style={styles.songItem}>
      <View style={styles.dragHandle}>
        <Ionicons name="reorder-three-outline" size={20} color={colors.text} />
      </View>

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

      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveSong(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
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

        <Text style={styles.headerTitle}>{isEditing ? 'Edit Playlist' : playlist.name}</Text>

        <View style={styles.headerActions}>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Playlist Info */}
      <View style={styles.playlistInfo}>
        <Image
          source={{ uri: playlist.image || 'https://via.placeholder.com/120' }}
          style={styles.playlistImage}
        />

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.nameInput}
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder="Playlist name"
              placeholderTextColor={colors.inputPlaceholderLight}
            />
            <TextInput
              style={styles.descriptionInput}
              value={playlistDescription}
              onChangeText={setPlaylistDescription}
              placeholder="Description (optional)"
              placeholderTextColor={colors.inputPlaceholderLight}
              multiline
              textAlignVertical="top"
            />
          </View>
        ) : (
          <View style={styles.playlistDetails}>
            <Text style={styles.playlistName}>{playlist.name}</Text>
            {playlist.description && (
              <Text style={styles.playlistDescription}>{playlist.description}</Text>
            )}
            <Text style={styles.playlistStats}>
              {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {!isEditing && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayAll}>
            <Ionicons name="play" size={20} color="white" />
            <Text style={styles.playButtonText}>Play All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

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
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.inputBackgroundLight,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: colors.inputBackgroundLight,
    borderRadius: 8,
    color: colors.inputTextLight,
    fontSize: 16,
    minHeight: 80,
    padding: 12,
  },
  dragHandle: {
    marginRight: 12,
  },
  editForm: {
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
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
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
  nameInput: {
    backgroundColor: colors.inputBackgroundLight,
    borderRadius: 8,
    color: colors.inputTextLight,
    fontSize: 16,
    marginBottom: 12,
    padding: 12,
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
  saveButton: {
    backgroundColor: colors.activityIndicator,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
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

export default PlaylistEditScreen;
