import { FC } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { ImageTileProps } from '@/components/tiles/types/image-tile';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';

export interface PlaylistTileProps extends ImageTileProps {
  onPress?: () => void; // click handler for playing/viewing playlist
  onEdit?: () => void; // click handler for editing playlist
}

const PlaylistTile: FC<PlaylistTileProps> = ({ title, subtitle, image, onPress, onEdit }) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row bg-onyx p-1.5 rounded-md"
      style={({ pressed }) => pressed && { opacity: 0.8 }}>
      <Image
        source={typeof image === 'string' ? { uri: image } : image}
        className="rounded-sm"
        style={{ height: 78, width: 130 }}
      />
      <View className="flex-col flex-1 justify-evenly ml-3">
        <Text className="text-white font-roboto-mono text-md font-medium text-ellipsis w-full line-clamp-2">
          {title}
        </Text>
        <Text className="text-gray-300 font-roboto-mono text-base line-clamp-1">{subtitle}</Text>
      </View>

      {/* Edit Button */}
      {onEdit && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the main onPress
            onEdit();
          }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 16,
            padding: 6,
          }}>
          <Ionicons name="create-outline" size={16} color={colors.text} />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default PlaylistTile;
