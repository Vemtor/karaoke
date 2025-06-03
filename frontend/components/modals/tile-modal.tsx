import React, { useState } from 'react';
import { Image, Modal, Text, TouchableWithoutFeedback, View, Alert } from 'react-native';

import useSelectedTileStore from '@/stores/selected-tile.store';

import { TileModalActionPressable, TileModalActionProps } from './tile-modal-action-pressable';
import { TILE_MODAL_ACTIONS_DATA } from './tile-modal-actions-data';
import { TileModalAction } from './types/tile-modal-action';
import { TILE_MODAL_ACTION_CONFIG } from './tile-actions-data';

import { useTrackPlayer } from '@/context/trackPlayerContext';
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';
import PlaylistSelectorModal from './playlist-selector-modal';
import usePlaylistStore from '../../stores/playlist.store';
import { useRouter } from 'expo-router';

const TileModal: React.FC = () => {
  const router = useRouter();
  const { addSongToQueue, removeSongFromQueue, addMultipleSongsToQueue } = useTrackPlayer();
  const { getPlaylistById, deletePlaylist } = usePlaylistStore();
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  const visible = useSelectedTileStore((state) => state.visible);
  const variant = useSelectedTileStore((state) => state.variant);
  const tileData = useSelectedTileStore((state) => state.tileData);
  const songTrack = useSelectedTileStore((state) => state.songTrack);
  const searchedVideo = useSelectedTileStore((state) => state.searchedVideo);
  const playlistId = useSelectedTileStore((state) => state.playlistId);
  const setVisible = useSelectedTileStore((state) => state.setVisible);
  const setTileData = useSelectedTileStore((state) => state.setTileData);
  const setSongTrack = useSelectedTileStore((state) => state.setSongTrack);
  const setSearchedVideo = useSelectedTileStore((state) => state.setSearchedVideo);
  const setPlaylistId = useSelectedTileStore((state) => state.setPlaylistId);

  if (!visible || !tileData || !variant) {
    return null;
  }

  const actions: TileModalActionProps[] = TILE_MODAL_ACTIONS_DATA[variant];

  const onClose = () => {
    setVisible(false);
    setTileData(null);
    setSongTrack(null);
    setSearchedVideo(null);
    setPlaylistId(null);
  };

  const handlePlayPlaylist = () => {
    if (playlistId) {
      const playlist = getPlaylistById(playlistId);
      if (playlist && playlist.songs.length > 0) {
        addMultipleSongsToQueue(playlist.songs);
        Alert.alert('Success', `Added ${playlist.songs.length} songs to queue`);
      } else {
        Alert.alert('Info', 'This playlist is empty');
      }
    }
  };

  const handleEditPlaylist = () => {
    if (playlistId) {
      router.push(`/playlist/edit/${playlistId}`);
      onClose();
    }
  };

  const handleDeletePlaylist = () => {
    if (playlistId) {
      const playlist = getPlaylistById(playlistId);
      if (playlist) {
        Alert.alert(
          'Delete Playlist',
          `Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                deletePlaylist(playlistId);
                onClose();
              },
            },
          ],
        );
      }
    }
  };

  // Convert SongTrack to SearchedVideo format for playlist selector
  const getSongForPlaylist = (): SearchedVideo | null => {
    if (searchedVideo) {
      return searchedVideo;
    }

    if (songTrack) {
      // Convert SongTrack to SearchedVideo format
      return {
        id: songTrack.id || Date.now().toString(),
        title: songTrack.title || 'Unknown Title',
        channelTitle: songTrack.artist || 'Unknown Artist',
        thumbnailUrl: songTrack.thumbnailUrl || '',
        formattedDuration: songTrack.duration || '0:00',
        // Add other required SearchedVideo properties with defaults
        description: '',
        publishedAt: new Date().toISOString(),
        channelId: '',
        videoId: songTrack.id || Date.now().toString(),
        // Add the missing videoUrl property
        videoUrl: songTrack.youtubeUrl || `https://www.youtube.com/watch?v=${songTrack.id}`,
        // Add any other missing properties from SearchedVideo interface
        rawDuration: songTrack.duration || '0:00',
      } as SearchedVideo;
    }

    return null;
  };

  return (
    <>
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-onyx rounded-lg p-4 w-72 items-center">
              <Image
                className="rounded-md mb-2.5"
                style={{ height: 120, width: 120 }}
                source={
                  typeof tileData.image === 'string' ? { uri: tileData.image } : tileData.image
                }
              />
              <Text className="text-base font-bold text-white text-center mb-1 font-roboto-mono">
                {tileData.title}
              </Text>
              <Text className="text-sm text-white mb-3 font-roboto-mono">{tileData.subtitle}</Text>

              {actions.map((action, index) => (
                <TileModalActionPressable
                  key={index}
                  label={action.label}
                  onPress={() => {
                    if (
                      action.label ===
                        TILE_MODAL_ACTION_CONFIG[TileModalAction.REMOVE_FROM_QUEUE].label &&
                      songTrack
                    ) {
                      removeSongFromQueue(songTrack);
                      Alert.alert('Success', 'Song removed from queue');
                    } else if (
                      action.label === TILE_MODAL_ACTION_CONFIG[TileModalAction.ADD_TO_QUEUE].label
                    ) {
                      const song = getSongForPlaylist();
                      if (song) {
                        addSongToQueue(song);
                        Alert.alert('Success', 'Song added to queue');
                      }
                    } else if (
                      action.label ===
                      TILE_MODAL_ACTION_CONFIG[TileModalAction.ADD_TO_PLAYLIST].label
                    ) {
                      const song = getSongForPlaylist();
                      if (song) {
                        setShowPlaylistSelector(true);
                        return; // Don't close modal yet
                      } else {
                        Alert.alert('Error', 'Cannot add this song to playlist');
                      }
                    } else if (
                      action.label ===
                        TILE_MODAL_ACTION_CONFIG[TileModalAction.REMOVE_FROM_PLAYLIST].label &&
                      searchedVideo
                    ) {
                      console.log('Remove song from Playlist');
                    } else if (
                      action.label === TILE_MODAL_ACTION_CONFIG[TileModalAction.PLAY_PLAYLIST].label
                    ) {
                      handlePlayPlaylist();
                    } else if (
                      action.label ===
                      TILE_MODAL_ACTION_CONFIG[TileModalAction.DOWNLOAD_PLAYLIST].label
                    ) {
                      Alert.alert('Info', 'Download feature coming soon!');
                    } else if (
                      action.label === TILE_MODAL_ACTION_CONFIG[TileModalAction.EDIT_PLAYLIST].label
                    ) {
                      handleEditPlaylist();
                      return; // Don't close modal - navigation will handle it
                    } else if (
                      action.label ===
                      TILE_MODAL_ACTION_CONFIG[TileModalAction.DELETE_PLAYLIST].label
                    ) {
                      handleDeletePlaylist();
                      return; // Don't close modal - alert will handle it
                    } else {
                      action.onPress();
                    }
                    onClose();
                  }}
                  type={action.type}
                />
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Playlist Selector Modal */}
      {showPlaylistSelector && getSongForPlaylist() && (
        <PlaylistSelectorModal
          visible={showPlaylistSelector}
          onClose={() => {
            setShowPlaylistSelector(false);
            onClose(); // Close the main modal too
          }}
          song={getSongForPlaylist()!}
        />
      )}
    </>
  );
};

export default TileModal;
