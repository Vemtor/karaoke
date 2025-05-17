/* eslint-disable no-unused-vars */

import { TileModalVariant } from '@/components/modals/types/tile-modal.enum';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
import { create } from 'zustand';

interface SelectedTileState {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  variant: TileModalVariant | null;
  setVariant: (variant: TileModalVariant | null) => void;
  tileData: ImageTileProps | null;
  setTileData: (tileData: ImageTileProps | null) => void;
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
}));

export default useSelectedTileStore;
