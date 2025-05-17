import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';

import { TILE_MODAL_ACTIONS_DATA } from './tile-modal-actions-data';
import { TileModalActionPressable, TileModalActionProps } from './tile-modal-action-pressable';
import useSelectedTileStore from '@/stores/selected-tile.store';

const TileModal: React.FC = () => {
  const visible = useSelectedTileStore((state) => state.visible);
  const variant = useSelectedTileStore((state) => state.variant);
  const tileData = useSelectedTileStore((state) => state.tileData);
  const setVisible = useSelectedTileStore((state) => state.setVisible);
  const setTileData = useSelectedTileStore((state) => state.setTileData);

  if (!visible || !tileData || !variant) {
    return null;
  }

  const actions: TileModalActionProps[] = TILE_MODAL_ACTIONS_DATA[variant];

  const onClose = () => {
    setVisible(false);
    setTileData(null);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Image
              style={styles.image}
              source={
                typeof tileData.image === 'string' ? { uri: tileData!.image } : tileData.image
              }
            />
            <Text style={styles.title}>{tileData.title}</Text>
            <Text style={styles.subtitle}>{tileData.subtitle}</Text>

            {actions.map((action, index) => (
              <TileModalActionPressable
                key={index}
                label={action.label}
                onPress={() => {
                  action.onPress();
                  onClose();
                }}
                type={action.type}
              />
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TileModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.onyx,
    borderRadius: 8,
    padding: 16,
    width: 300,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 6,
    marginBottom: 10,
  },
  title: {
    ...Typography['text-base'],
    ...Typography['font-bold'],
    color: Colors.white,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography['text-xs'],
    color: Colors.white,
    marginBottom: 12,
  },

  whiteText: {
    color: Colors.white,
  },
});
