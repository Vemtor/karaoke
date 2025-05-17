import { FC } from 'react';
import { TileModalActionVariant } from './types/tile-modal-action';
import { StyleSheet, Pressable, Text } from 'react-native';
import Typography from '@/constants/typography';
import Colors from '@/constants/colors';
import useSelectedTileStore from '@/stores/selected-tile.store';

export interface TileModalActionProps {
  label: string;
  // This signauture may be changed when this part is connected with other features
  // like queueing a song or adding a song to a playlist
  onPress: () => void;
  type: TileModalActionVariant;
}

export const TileModalActionPressable: FC<TileModalActionProps> = ({ label, onPress, type }) => {
  return (
    <Pressable
      style={[
        styles.button,
        type === TileModalActionVariant.SUCCESS && styles.success,
        type === TileModalActionVariant.DANGER && styles.danger,
      ]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    width: '100%',
  },
  buttonText: {
    color: Colors.black,
    textAlign: 'center',
    ...Typography['font-medium'],
  },
  success: {
    backgroundColor: Colors['tea-green'],
  },
  danger: {
    backgroundColor: Colors.pomegranate,
  },
});
