import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import { FC } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
export interface SongTileProps extends ImageTileProps {
  isQueued: boolean;
  onPress?: () => void; // click handler here
  // otherProps: any; // other props if needed
}

const SongTile: FC<SongTileProps> = ({ isQueued = false, title, subtitle, image, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.imageWrapper}>
        <Image style={styles.image} source={typeof image === 'string' ? { uri: image } : image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.songTitle}>{title}</Text>
        <Text style={styles.artistName}>{subtitle}</Text>
      </View>
    </Pressable>
  );
};

export default SongTile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.onyx,
    padding: 6,
    gap: 5,
    borderRadius: 6,
  },
  pressed: {
    opacity: 0.8,
  },
  imageWrapper: {
    width: 54,
    height: 54,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  songTitle: {
    color: Colors.white,
    ...Typography['font-regular'],
    ...Typography['text-sm'],
  },
  artistName: {
    color: Colors.white,
    ...Typography['font-regular'],
    ...Typography['text-xs'],
  },
});
