import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchSongLyrics, splitAudio } from '@/services/backendApi';
import { useSongText } from '@/context/songTextContext';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import TrackPlayer from 'react-native-track-player';
import SongText from '@/types/SongText';

interface SongManagerContextProps {
    url: string | null;
    setUrl: (url: string) => void;
}

const SongManagerContext = createContext<SongManagerContextProps | undefined>(undefined);

export const SongManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [url, setUrl] = useState<string | null>(null);
    const { setSongText } = useSongText();
    const { isTrackPlayerReady } = useTrackPlayer();

    useEffect(() => {
        const loadSong = async (youtubeUrl: string) => {
            try {
                console.log('Loading song from URL:', youtubeUrl);
                const fetchedSongText = await fetchSongLyrics(youtubeUrl);
                console.log('Fetched song text:', fetchedSongText);
                setSongText(fetchedSongText as unknown as SongText);

                const fetchedAudioSplitterResponse = await splitAudio(youtubeUrl);
                console.log('Fetched audio splitter response:', fetchedAudioSplitterResponse);

                const songUrl = 'http://localhost:8080' + fetchedAudioSplitterResponse.instrumentsPath;
                console.log('Song URL:', songUrl);

                const track = {
                    url: songUrl,
                    title: 'Never Gonna Give You Up',
                    duration: 272,
                };

                if (isTrackPlayerReady) {
                    TrackPlayer.stop();
                    await TrackPlayer.add(track);
                    console.log('Track added to TrackPlayer:', track);
                } else {
                    console.warn('TrackPlayer is not ready yet!');
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error loading song:', error.message);
                    const dummySongText: SongText = { full_text: '', segments: [] };
                    setSongText(dummySongText);
                }
            }
        };

        if (url) {
            loadSong(url);
        }
    }, [url, setSongText, isTrackPlayerReady]);

    return (
        <SongManagerContext.Provider value={{ url, setUrl }}>
            {children}
        </SongManagerContext.Provider>
    );
};

export const useSongManager = () => {
    const context = useContext(SongManagerContext);
    if (!context) {
        throw new Error('useSongManager must be used within a SongManagerProvider');
    }
    return context;
};