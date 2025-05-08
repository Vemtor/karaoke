import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { ImageTileProps } from '../tiles/types/image-tile';

export interface ModalMenuProps extends Omit<ImageTileProps, 'image'> {
  handleClose: () => void;
}

export default function ModalMenu() {
  const [visible, setVisible] = useState(false);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
        <Pressable style={styles.popup} onPress={() => {}}>
          <Text style={styles.popupItem}>Option 1</Text>
          <Text style={styles.popupItem}>Option 2</Text>
          <Text style={styles.popupItem}>Cancel</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dims the background
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: 250,
    alignItems: 'center',
  },
  popupItem: {
    padding: 10,
    fontSize: 16,
  },
});
