/* eslint-disable no-unused-vars */

import { create } from 'zustand';

import { TileModalVariant } from '@/components/modals/types/tile-modal.enum';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
import { SongTrack } from '@/types/songTypes';
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';

interface SelectedTileState {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  variant: TileModalVariant | null;
  setVariant: (variant: TileModalVariant | null) => void;
  tileData: ImageTileProps | null;
  setTileData: (tileData: ImageTileProps | null) => void;
  songTrack: SongTrack | null;
  setSongTrack: (songTrack: SongTrack | null) => void;
  searchedVideo: SearchedVideo | null;
  setSearchedVideo: (searchedVideo: SearchedVideo | null) => void;
}

const useSelectedTileStore = create<SelectedTileState>((set) => ({
  visible: false,
  setVisible: (visible: boolean) => {
    set({ visible });
  },
  variant: null,
  setVariant: (variant: TileModalVariant | null) => {
    set({ variant });
  },
  tileData: null,
  setTileData: (tileData: ImageTileProps | null) => {
    set({ tileData });
  },
  songTrack: null,
  setSongTrack: (songTrack: SongTrack | null) => {
    set({ songTrack });
  },
  searchedVideo: null,
  setSearchedVideo: (searchedVideo: SearchedVideo | null) => {
    set({ searchedVideo });
  },
}));

export default useSelectedTileStore;
