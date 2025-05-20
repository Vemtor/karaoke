import clsx from 'clsx';
import { FC } from 'react';
import { Pressable, Text } from 'react-native';

import { TileModalActionVariant } from './types/tile-modal-action';
import { SongTrack } from '@/types/songTypes';
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';

export interface TileModalActionProps {
  label: string;
  // This signauture may be changed when this part is connected with other features
  // like queueing a song or adding a song to a playlist
  onPress: () => void | ((track: SongTrack) => void);
  type: TileModalActionVariant;
}

export const TileModalActionPressable: FC<TileModalActionProps> = ({ label, onPress, type }) => {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        'rounded-md py-2 px-4 mt-2 w-full',
        type === TileModalActionVariant.NEUTRAL && 'bg-white',
        type === TileModalActionVariant.SUCCESS && 'bg-tea-green',
        type === TileModalActionVariant.DANGER && 'bg-pomegranate',
      )}>
      <Text className="text-black text-center font-roboto-mono">{label}</Text>
    </Pressable>
  );
};
