import { FC } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { ImageTileProps } from '@/components/tiles/types/image-tile';
import { SongTrack } from '@/types/songTypes';

export interface SongTileProps extends ImageTileProps {
  onPress?: () => void; // click handler here
  // otherProps: any; // other props if needed
}

const SongTile: FC<SongTileProps> = ({ title, subtitle, image, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row bg-onyx p-1.5 rounded-md gap-1.5"
      style={({ pressed }) => pressed && { opacity: 0.8 }}>
      <Image
        className="rounded-md"
        source={typeof image === 'string' ? { uri: image } : image}
        style={{ height: 56, width: 56 }}
      />
      <View className="flex-col justify-evenly">
        <Text className="text-white font-medium text-sm">{title}</Text>
        <Text className="text-gray-300 font-regular text-xs">{subtitle}</Text>
      </View>
    </Pressable>
  );
};

export default SongTile;
