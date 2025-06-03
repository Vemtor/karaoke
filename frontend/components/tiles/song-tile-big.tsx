import { FC } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { ImageTileProps } from '@/components/tiles/types/image-tile';

export interface SongTileBigProps extends ImageTileProps {
  onPress?: () => void; // click handler here
  // otherProps: any; // other props if needed
}

const SongTileBig: FC<SongTileBigProps> = ({title, subtitle, image, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row bg-onyx p-1.5 rounded-md"
      style={({ pressed }) => pressed && { opacity: 0.8 }}>
      <Image
        source={typeof image === 'string' ? { uri: image } : image} // Fix for cached images
        className="rounded-sm"
        style={{ height: 78, width: 130 }}
      />
      <View className="flex-col flex-1 justify-evenly ml-3">
        <Text className="text-white font-roboto-mono text-md font-medium text-ellipsis w-full line-clamp-2">{title}</Text>
        <Text className="text-gray-300 font-roboto-mono text-base line-clamp-1">{subtitle}</Text>
      </View>
    </Pressable>
  );
};

export default SongTileBig;