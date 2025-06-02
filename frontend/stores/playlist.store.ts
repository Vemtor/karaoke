import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
    updatePlaylist: (id: string, updates: Partial<Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>>) => void;
    deletePlaylist: (id: string) => void;
    addSongToPlaylist: (playlistId: string, song: SearchedVideo) => void;
    removeSongFromPlaylist: (playlistId: string, songId: string) => void;
    reorderSongsInPlaylist: (playlistId: string, fromIndex: number, toIndex: number) => void;
    getPlaylistById: (id: string) => Playlist | undefined;
}

const usePlaylistStore = create<PlaylistState>()(
    persist(
        (set, get) => ({
            playlists: [],

            createPlaylist: (name: string, description = '', image = '') => {
                const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                const newPlaylist: Playlist = {
                    id,
                    name,
                    description,
                    image,
                    songs: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set((state) => ({
                    playlists: [...state.playlists, newPlaylist],
                }));

                return id;
            },

            updatePlaylist: (id: string, updates: Partial<Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>>) => {
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === id
                            ? { ...playlist, ...updates, updatedAt: new Date() }
                            : playlist
                    ),
                }));
            },

            deletePlaylist: (id: string) => {
                set((state) => ({
                    playlists: state.playlists.filter((playlist) => playlist.id !== id),
                }));
            },

            addSongToPlaylist: (playlistId: string, song: SearchedVideo) => {
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === playlistId
                            ? {
                                ...playlist,
                                songs: [...playlist.songs, song],
                                updatedAt: new Date(),
                            }
                            : playlist
                    ),
                }));
            },

            removeSongFromPlaylist: (playlistId: string, songId: string) => {
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === playlistId
                            ? {
                                ...playlist,
                                songs: playlist.songs.filter((song) => song.id !== songId),
                                updatedAt: new Date(),
                            }
                            : playlist
                    ),
                }));
            },

            reorderSongsInPlaylist: (playlistId: string, fromIndex: number, toIndex: number) => {
                set((state) => ({
                    playlists: state.playlists.map((playlist) => {
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
                    }),
                }));
            },

            getPlaylistById: (id: string) => {
                return get().playlists.find((playlist) => playlist.id === id);
            },
        }),
        {
            name: 'playlist-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default usePlaylistStore;