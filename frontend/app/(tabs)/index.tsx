import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { mockPlaylists, mockSongs } from '@/components/home/mock-data';
import TileModal from '@/components/modals/tile-modal';
import { TileModalVariant } from '@/components/modals/types/tile-modal.enum';
import TileGrid from '@/components/tile-grid';
import PlaylistTile, { PlaylistTileProps } from '@/components/tiles/playlist-tile';
import SongTile, { SongTileProps } from '@/components/tiles/song-tile';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
import ViewLayout from '@/components/wrappers/view-laytout';
import useSelectedTileStore from '@/stores/selected-tile.store';

const HomeScreen = () => {
  const setVisible = useSelectedTileStore((state) => state.setVisible);
  const setVariant = useSelectedTileStore((state) => state.setVariant);
  const setTileData = useSelectedTileStore((state) => state.setTileData);
  const tileData = useSelectedTileStore((state) => state.tileData);

  const [recentSongs, setRecentSongs] = useState<SongTileProps[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<PlaylistTileProps[]>([]);

  const openTileModal = useCallback(
    (tile: ImageTileProps, variant: TileModalVariant) => {
      setTileData(tile);
      setVisible(true);
      setVariant(variant);
    },
    [setTileData, setVisible, setVariant],
  );

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
  }, [openTileModal]);

  return (
    <ViewLayout>
      <View className="flex flex-col gap-[14px]">
        <View className="items-center justify-center bg-quartz min-h-[73px] rounded-lg">
          <Text className="self-center text-black font-bold text-xl font-roboto-mono">
            &lt;LOGO SOON&gt;
          </Text>
        </View>

        <TileGrid<SongTileProps> tiles={recentSongs} tileComponent={SongTile} columns={2} />

        <View className="min-h-[45px] rounded-lg bg-quartz items-center justify-center">
          <Text className="text-black font-bold text-md font-roboto-mono">
            Recently played playlists:
          </Text>
        </View>

        <TileGrid<PlaylistTileProps>
          tiles={recentPlaylists}
          tileComponent={PlaylistTile}
          columns={1}
        />
      </View>

      {tileData && <TileModal />}
    </ViewLayout>
  );
};

export default HomeScreen;
