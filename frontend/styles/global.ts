import Colors from '@/constants/colors';
import { StyleSheet, Platform } from 'react-native';
export default StyleSheet.create({
  'safe-area-container': {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    backgroundColor: Colors['coffee-black'],
    padding: 14,
  },
});
