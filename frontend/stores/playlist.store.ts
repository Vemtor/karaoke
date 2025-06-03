import { create } from 'zustand';
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  songs: SearchedVideo[];
  createdAt: Date;
  updatedAt: Date;
}

interface PlaylistState {
  playlists: Playlist[];

  // Actions
  createPlaylist: (name: string, description?: string, image?: string) => string;
  updatePlaylist: (
    id: string,
    updates: Partial<Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: SearchedVideo) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  reorderSongsInPlaylist: (playlistId: string, fromIndex: number, toIndex: number) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  loadFromStorage: () => void;
}

// Helper functions for localStorage
const STORAGE_KEY = 'playlist-storage';

const saveToStorage = (playlists: Playlist[]) => {
  try {
    const serialized = JSON.stringify({
      state: { playlists },
      version: 0,
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Failed to save playlists to localStorage:', error);
  }
};

const loadFromStorage = (): Playlist[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    const playlists = parsed.state?.playlists || [];

    // Convert date strings back to Date objects
    return playlists.map((playlist: any) => ({
      ...playlist,
      createdAt: new Date(playlist.createdAt),
      updatedAt: new Date(playlist.updatedAt),
    }));
  } catch (error) {
    console.warn('Failed to load playlists from localStorage:', error);
    return [];
  }
};

const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],

  loadFromStorage: () => {
    const storedPlaylists = loadFromStorage();
    set({ playlists: storedPlaylists });
  },

  createPlaylist: (name: string, description = '', image = '') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    console.log('playlist id', id);
    const newPlaylist: Playlist = {
      id,
      name,
      description,
      image,
      songs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => {
      const newPlaylists = [...state.playlists, newPlaylist];
      saveToStorage(newPlaylists);
      return { playlists: newPlaylists };
    });

    return id;
  },

  updatePlaylist: (
    id: string,
    updates: Partial<Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => {
    set((state) => {
      const newPlaylists = state.playlists.map((playlist) =>
        playlist.id === id ? { ...playlist, ...updates, updatedAt: new Date() } : playlist,
      );
      saveToStorage(newPlaylists);
      return { playlists: newPlaylists };
    });
  },

  deletePlaylist: (id: string) => {
    console.log(playlist.id);
    set((state) => {
      const newPlaylists = state.playlists.filter((playlist) => playlist.id !== id);
      saveToStorage(newPlaylists);
      return { playlists: newPlaylists };
    });
  },

  addSongToPlaylist: (playlistId: string, song: SearchedVideo) => {
    set((state) => {
      const newPlaylists = state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: [...playlist.songs, song],
              updatedAt: new Date(),
            }
          : playlist,
      );
      saveToStorage(newPlaylists);
      return { playlists: newPlaylists };
    });
  },

  removeSongFromPlaylist: (playlistId: string, songId: string) => {
    set((state) => {
      console.log('Removing song:', { playlistId, songId });
      console.log(
        'Current playlists:',
        state.playlists.map((p) => ({ id: p.id, name: p.name, songCount: p.songs.length })),
      );

      const targetPlaylist = state.playlists.find((playlist) => playlist.id === playlistId);
      if (!targetPlaylist) {
        console.warn(`Playlist with ID ${playlistId} not found`);
        return state; // Return unchanged state if playlist not found
      }

      console.log(
        'Target playlist songs before removal:',
        targetPlaylist.songs.map((s) => ({ id: s.id, title: s.title })),
      );

      const songExists = targetPlaylist.songs.some((song) => song.id === songId);
      if (!songExists) {
        console.warn(`Song with ID ${songId} not found in playlist ${playlistId}`);
        return state; // Return unchanged state if song not found
      }

      const newPlaylists = state.playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          const filteredSongs = playlist.songs.filter((song) => {
            const shouldKeep = song.id !== songId;
            if (!shouldKeep) {
              console.log('Removing song:', { id: song.id, title: song.title });
            }
            return shouldKeep;
          });

          console.log(
            `Songs after filtering: ${filteredSongs.length} (was ${playlist.songs.length})`,
          );

          return {
            ...playlist,
            songs: filteredSongs,
            updatedAt: new Date(),
          };
        }
        return playlist;
      });

      console.log(
        'Updated playlists:',
        newPlaylists.map((p) => ({ id: p.id, name: p.name, songCount: p.songs.length })),
      );

      saveToStorage(newPlaylists);
      return { playlists: newPlaylists };
    });
  },

  reorderSongsInPlaylist: (playlistId: string, fromIndex: number, toIndex: number) => {
    set((state) => {
      const newPlaylists = state.playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          const newSongs = [...playlist.songs];
          const [movedSong] = newSongs.splice(fromIndex, 1);
          newSongs.splice(toIndex, 0, movedSong);

          return {
            ...playlist,
            songs: newSongs,
            updatedAt: new Date(),
          };
        }
        return playlist;
      });
      saveToStorage(newPlaylists);
      return { playlists: newPlaylists };
    });
  },

  getPlaylistById: (id: string) => {
    return get().playlists.find((playlist) => playlist.id === id);
  },
}));

// Initialize the store with data from localStorage
if (typeof window !== 'undefined') {
  usePlaylistStore.getState().loadFromStorage();
}

export default usePlaylistStore;
