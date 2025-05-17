/* eslint-disable no-unused-vars */

import { TILE_MODAL_ACTION_CONFIG } from './tile-actions-data';
import { TileModalActionProps } from './tile-modal-action-pressable';
import { TileModalAction } from './types/tile-modal-action';
import { TileModalVariant } from './types/tile-modal.enum';

export const TILE_MODAL_ACTIONS_DATA: Record<TileModalVariant, TileModalActionProps[]> = {
  [TileModalVariant.NEW_SONG]: [
    TILE_MODAL_ACTION_CONFIG[TileModalAction.ADD_TO_QUEUE],
    TILE_MODAL_ACTION_CONFIG[TileModalAction.ADD_TO_PLAYLIST],
  ],
  [TileModalVariant.QUEUED_SONG]: [
    TILE_MODAL_ACTION_CONFIG[TileModalAction.REMOVE_FROM_QUEUE],
    TILE_MODAL_ACTION_CONFIG[TileModalAction.ADD_TO_PLAYLIST],
  ],
  [TileModalVariant.PLAYLIST_SONG]: [
    TILE_MODAL_ACTION_CONFIG[TileModalAction.REMOVE_FROM_PLAYLIST],
    TILE_MODAL_ACTION_CONFIG[TileModalAction.ADD_TO_QUEUE],
  ],
  [TileModalVariant.NEW_PLAYLIST]: [
    TILE_MODAL_ACTION_CONFIG[TileModalAction.PLAY_PLAYLIST],
    TILE_MODAL_ACTION_CONFIG[TileModalAction.DOWNLOAD_PLAYLIST],
    TILE_MODAL_ACTION_CONFIG[TileModalAction.EDIT_PLAYLIST],
  ],
};
