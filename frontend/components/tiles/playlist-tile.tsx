import Colors from '@/constants/colors';
import Typography from '@/constants/typography';
import { FC } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { ImageTileProps } from '@/components/tiles/types/image-tile';

export interface PlaylistTileProps extends ImageTileProps {
  onPress?: () => void; // click handler here
  // otherProps: any; // other props if needed
}

const PlaylistTile: FC<PlaylistTileProps> = ({ title, subtitle, image, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <Image style={styles.image} source={typeof image === 'string' ? { uri: image } : image} />
      <View style={styles.textContainer}>
        <Text style={styles.songTitle}>{title}</Text>
        <Text style={styles.artistName}>{subtitle}</Text>
      </View>
    </Pressable>
  );
};

export default PlaylistTile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.onyx,
    padding: 6,
    gap: 14,
    borderRadius: 6,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    height: 78,
    width: 130,
    borderRadius: 5,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  songTitle: {
    color: Colors.white,
    ...Typography['font-regular'],
    ...Typography['text-md'],
  },
  artistName: {
    color: Colors.white,
    ...Typography['font-regular'],
    ...Typography['text-base'],
  },
});
