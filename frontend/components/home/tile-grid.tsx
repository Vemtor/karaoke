import { FlatList, View, StyleSheet } from 'react-native';
import { ImageTileProps } from '../tiles/types/image-tile';

interface TileGridProps<T> {
  tiles: T[];
  tileComponent: React.ComponentType<T>;
  columns?: number;
}

export default function TileGrid<T extends ImageTileProps>({
  tiles,
  tileComponent: Tile,
  columns = 2,
}: TileGridProps<T>) {
  return (
    <FlatList
      data={tiles}
      renderItem={({ item }) => <Tile {...item} />}
      keyExtractor={(_, index) => index.toString()}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.gridContainer}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: { gap: 4 },
  row: {
    gap: 4,
  },
});
