import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';

type TilePopupVariant = 'song' | 'playlist';

type ActionType = 'default' | 'success' | 'danger';

interface PopupAction {
  label: string;
  onPress: () => void;
  type?: ActionType;
}

interface TilePopupModalProps {
  visible: boolean;
  onClose: () => void;
  variant: TilePopupVariant;
  title: string;
  subtitle: string;
  image: string | number;
  actions: PopupAction[];
}

const TilePopupModal: React.FC<TilePopupModalProps> = ({
  visible,
  onClose,
  variant,
  title,
  subtitle,
  image,
  actions,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image
                style={styles.image}
                source={typeof image === 'string' ? { uri: image } : image}
              />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              {actions.map((action, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.button,
                    action.type === 'success' && styles.success,
                    action.type === 'danger' && styles.danger,
                  ]}
                  onPress={() => {
                    onClose();
                    action.onPress();
                  }}>
                  <Text style={styles.buttonText}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TilePopupModal;

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
  whiteText: {
    color: Colors.white,
  },
  success: {
    backgroundColor: Colors['tea-green'],
  },
  danger: {
    backgroundColor: Colors.pomegranate,
  },
});
