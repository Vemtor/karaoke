import React from 'react';
import { Image, Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

import useSelectedTileStore from '@/stores/selected-tile.store';

import { TileModalActionPressable, TileModalActionProps } from './tile-modal-action-pressable';
import { TILE_MODAL_ACTIONS_DATA } from './tile-modal-actions-data';

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
        <View className="flex-1  bg-black/50 justify-center items-center">
          <View className="bg-onyx rounded-lg p-4 w-72 items-center">
            <Image
              className="rounded-md mb-2.5"
              style={{ height: 120, width: 120 }}
              source={typeof tileData.image === 'string' ? { uri: tileData.image } : tileData.image}
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
