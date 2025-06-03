import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import TileModal from '@/components/modals/tile-modal';
import {TileModalVariant} from '@/components/modals/types/tile-modal.enum';
import TileGrid from '@/components/tile-grid';
import PlaylistTile, {PlaylistTileProps} from '@/components/tiles/playlist-tile';
import SongTile, {SongTileProps} from '@/components/tiles/song-tile-small';
import {ImageTileProps} from '@/components/tiles/types/image-tile';
import ViewLayout from '@/components/wrappers/view-laytout';
import useSelectedTileStore from '@/stores/selected-tile.store';
import usePlaylistStore from '@/stores/playlist.store';
import {useRouter} from 'expo-router';
import colors from '@/constants/colors';

const DEFAULT_PLAYLIST_IMAGE = `data:image/svg+xml;base64,${btoa(`
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="#444444"/>
    <path d="M60 40L70 60H50L60 40Z" fill="#777777"/>
  </svg>
`)}`;

const HomeScreen = () => {
  const router = useRouter();
  const { playlists, createPlaylist } = usePlaylistStore();

  const setVisible = useSelectedTileStore((state) => state.setVisible);
  const setVariant = useSelectedTileStore((state) => state.setVariant);
  const setTileData = useSelectedTileStore((state) => state.setTileData);
  const setPlaylistId = useSelectedTileStore((state) => state.setPlaylistId);
  const tileData = useSelectedTileStore((state) => state.tileData);

  const [recentSongs, setRecentSongs] = useState<SongTileProps[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<PlaylistTileProps[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    const playlistId = createPlaylist(
      playlistName.trim(),
      playlistDescription.trim(),
      DEFAULT_PLAYLIST_IMAGE,
    );

    console.log('trackPlayerContext', playlistId);
    setShowCreateModal(false);
    setPlaylistName('');
    setPlaylistDescription('');
    setPlaylistId(playlistId);

    Alert.alert('Success', 'Playlist created successfully!', [
      {
        text: 'OK',
        onPress: () => {
          // Navigate to the new playlist
          router.push(`/playlist/${playlistId}`);
        },
      },
    ]);
  };

  const openTileModal = useCallback(
    (tile: ImageTileProps, variant: TileModalVariant, playlistId?: string) => {
      console.log('openTileModal called with:', {
        tile: tile.title,
        variant,
        playlistId,
        hasPlaylistId: !!playlistId,
      });

      setTileData(tile);
      setVisible(true);
      setVariant(variant);

      // Always reset playlistId first, then set it if provided
      setPlaylistId(null);
      if (playlistId) {
        console.log('Setting playlistId to:', playlistId);
        setPlaylistId(playlistId);
      } else {
        console.log('No playlistId provided, setting to null');
      }
    },
    [setTileData, setVisible, setVariant, setPlaylistId],
  );

  const navigateToPlaylist = useCallback(
    (playlistId: string) => {
      router.push(`/playlist/${playlistId}`);
    },
    [router],
  );

  useEffect(() => {
    // Use mock songs for now (you can replace this with real recent songs later)
    // const augmentedSongs = mockSongs.map((song) => ({
    //     ...song,
    //     onPress: () => openTileModal(song, TileModalVariant.NEW_SONG),
    // }));
    // setRecentSongs(augmentedSongs);

    // Convert real playlists to tile format
    const augmentedPlaylists = playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.name,
      subtitle: `${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}`,
      image: playlist.image || DEFAULT_PLAYLIST_IMAGE,
      onPress: () => navigateToPlaylist(playlist.id),
      onLongPress: () =>
        openTileModal(
          {
            id: playlist.id,
            title: playlist.name,
            subtitle: `${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}`,
            image: playlist.image || DEFAULT_PLAYLIST_IMAGE,
          },
          TileModalVariant.NEW_PLAYLIST,
          playlist.id,
        ),
    }));
    setRecentPlaylists(augmentedPlaylists);
  }, [openTileModal, navigateToPlaylist, playlists]);

  return (
    <ViewLayout>
      <View className="flex flex-col gap-[14px]">
        <View className="items-center justify-center bg-quartz min-h-[73px] rounded-lg">
          <Text className="self-center text-black font-bold text-xl font-roboto-mono">
            &lt;LOGO SOON&gt;
          </Text>
        </View>

        <TileGrid<SongTileProps> tiles={recentSongs} tileComponent={SongTile} columns={2} />

        <View className="min-h-[45px] rounded-lg bg-quartz items-center justify-center flex-row justify-between px-4">
          <Text className="text-black font-bold text-md font-roboto-mono">
            {playlists.length > 0 ? 'Your playlists:' : 'No playlists yet'}
          </Text>

          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-black rounded-full p-2">
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {playlists.length > 0 ? (
          <TileGrid<PlaylistTileProps>
            tiles={recentPlaylists}
            tileComponent={PlaylistTile}
            columns={1}
          />
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500 text-center font-roboto-mono mb-4">
              Create your first playlist to get started
            </Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="bg-quartz px-6 py-3 rounded-lg">
              <Text className="text-black font-bold font-roboto-mono">Create Playlist</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {tileData && <TileModal />}

      {/* Create Playlist Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <View
            style={{
              backgroundColor: colors.background,
              padding: 24,
              borderRadius: 12,
              width: 320,
              maxWidth: '90%',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                marginBottom: 20,
                color: colors.text,
                textAlign: 'center',
              }}>
              Create New Playlist
            </Text>

            <TextInput
              placeholder="Playlist name"
              placeholderTextColor={colors.inputPlaceholderLight}
              value={playlistName}
              onChangeText={setPlaylistName}
              style={{
                backgroundColor: colors.inputBackgroundLight,
                color: colors.inputTextLight,
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 16,
              }}
            />

            <TextInput
              placeholder="Description (optional)"
              placeholderTextColor={colors.inputPlaceholderLight}
              value={playlistDescription}
              onChangeText={setPlaylistDescription}
              multiline
              textAlignVertical="top"
              style={{
                backgroundColor: colors.inputBackgroundLight,
                color: colors.inputTextLight,
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 16,
                minHeight: 80,
              }}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={handleCreatePlaylist}
                style={{
                  flex: 1,
                  backgroundColor: colors.activityIndicator,
                  padding: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 16,
                  }}>
                  Create
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setPlaylistName('');
                  setPlaylistDescription('');
                }}
                style={{
                  flex: 1,
                  backgroundColor: colors.inputBackgroundLight,
                  padding: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: '600',
                    fontSize: 16,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ViewLayout>
  );
};

export default HomeScreen;
