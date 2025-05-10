// This is a general interface for a tile component. PlaylistTile and SongTile may extend this interface to add more specific props and onClick handlers.
export interface ImageTileProps {
  title: string;
  subtitle: string;
  image: string;
}
