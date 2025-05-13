import { View, StyleSheet, Text } from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';

export default function SongViewText() {
  const { songLines } = useTrackPlayer();

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        <Text style={[styles.line]}>{songLines.previousLine}</Text>
        <View style={[styles.tint, styles.tintTop]} />
      </View>
      <Text style={[styles.line, styles.highlighted]}>{songLines.currentLine}</Text>
      <View style={styles.lineContainer}>
        <Text style={[styles.line]}>{songLines.nextLine}</Text>
        <View style={[styles.tint, styles.tintBottom]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191414',
  },
  lineContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginVertical: 8,
    zIndex: 0,
  },
  highlighted: {
    color: '#95E558',
  },
  tint: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  tintTop: {
    backgroundImage:
      'linear-gradient(to bottom, rgba(25, 20, 20, 1) 0%,rgba(25, 20, 20, 0.5) 75%, rgba(0, 0, 0, 0) 100%)',
  },
  tintBottom: {
    backgroundImage:
      'linear-gradient(to top, rgba(25, 20, 20, 1) 0%, rgba(25, 20, 20, 0.5) 75%, rgba(0, 0, 0, 0) 100%)',
  },
});
