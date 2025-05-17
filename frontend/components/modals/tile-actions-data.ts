import {
  handleAddToPlaylist,
  handleAddToQueue,
  handleDownloadPlaylist,
  handleEditPlaylist,
  handlePlayPlaylist,
  handleRemoveFromPlaylist,
  handleRemoveFromQueue,
} from '@/utils/modal-handlers';

import { TileModalActionProps } from './tile-modal-action-pressable';
import { TileModalAction, TileModalActionVariant } from './types/tile-modal-action';

export const TILE_MODAL_ACTION_CONFIG: Record<TileModalAction, TileModalActionProps> = {
  [TileModalAction.ADD_TO_QUEUE]: {
    label: 'Add to Queue',
    onPress: handleAddToQueue,
    type: TileModalActionVariant.SUCCESS,
  },
  [TileModalAction.ADD_TO_PLAYLIST]: {
    label: 'Add to Playlist',
    onPress: handleAddToPlaylist,
    type: TileModalActionVariant.NEUTRAL,
  },
  [TileModalAction.REMOVE_FROM_QUEUE]: {
    label: 'Remove from Queue',
    onPress: handleRemoveFromQueue,
    type: TileModalActionVariant.DANGER,
  },
  [TileModalAction.REMOVE_FROM_PLAYLIST]: {
    label: 'Remove from Playlist',
    onPress: handleRemoveFromPlaylist,
    type: TileModalActionVariant.DANGER,
  },
  [TileModalAction.PLAY_PLAYLIST]: {
    label: 'Play Playlist',
    onPress: handlePlayPlaylist,
    type: TileModalActionVariant.NEUTRAL,
  },
  [TileModalAction.DOWNLOAD_PLAYLIST]: {
    label: 'Download Playlist',
    onPress: handleDownloadPlaylist,
    type: TileModalActionVariant.NEUTRAL,
  },
  [TileModalAction.EDIT_PLAYLIST]: {
    label: 'Edit Playlist',
    onPress: handleEditPlaylist,
    type: TileModalActionVariant.NEUTRAL,
  },
};
