import { SongText } from '@/types/songTypes';
import axios from 'axios';
import API_ROUTES from '@/constants/apiRoutes';

export async function fetchSongLyrics(youtubeUrl: string): Promise<SongText> {
  if (!youtubeUrl || !youtubeUrl.startsWith('http')) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    const response = await axios.post(`${API_ROUTES.API_AUDIO_URL}/transcribe`, null, {
      params: { youtubeUrl },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching song lyrics:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch song lyrics');
  }
}

export async function splitAudio(
  youtubeUrl: string,
): Promise<{ instrumentsPath: string; vocalsPath: string }> {
  if (!youtubeUrl || !youtubeUrl.startsWith('http')) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    const response = await axios.post(`${API_ROUTES.API_AUDIO_URL}/split`, null, {
      params: { youtubeUrl },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error splitting audio:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to split audio');
  }
}
