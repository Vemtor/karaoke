import { SongTrack } from '@/types/songTypes';
import { useEffect, useState } from 'react';
import { getItem, setItem } from '@/services/storage';
import { useProgress } from 'react-native-track-player';

const TRANSCRIPTIONS = 'transcriptions';

export interface SongLinesType {
  previousSegmentIndex: number;
  previousLine: string | null;
  currentLine: string | null;
  nextLine: string | null;
}

interface UseLyricsEditingProps {
  currentTrack: SongTrack;
  songLines: SongLinesType;
  setSongLines: React.Dispatch<React.SetStateAction<SongLinesType>>;
  isPlaying: boolean;
  toggleSong: () => void;
  getTranscriptions: () => Promise<Map<string, SongTrack>>;
  loadSong: (track: SongTrack) => Promise<void>;
}

export const useLyricsEditing = ({
  currentTrack,
  songLines,
  setSongLines,
  isPlaying,
  toggleSong,
  getTranscriptions,
  loadSong,
}: UseLyricsEditingProps) => {
  const [editedLine, setEditedLine] = useState(songLines.currentLine);
  const [isEditing, setIsEditing] = useState(false);
  const [lineStart, setLineStart] = useState<number | null>(null);
  const [lineEnd, setLineEnd] = useState<number | null>(null);
  const progress = useProgress();

  const handleEditPress = async () => {
    if (isPlaying) {
      toggleSong();
    }
    setIsEditing(true);
  };

  const handleSavePress = async () => {
    if (editedLine != null) {
      if (lineStart === null || isNaN(lineStart)) {
        alert('Please enter a valid start time.');
        return;
      }
      if (lineEnd === null || isNaN(lineEnd)) {
        alert('Please enter a valid end time.');
        return;
      }
      if (lineStart >= lineEnd) {
        alert('Start time must be less than end time.');
        return;
      }
    }

    if (isEditing) {
      saveEditedLine();
    }
  };

  useEffect(() => {
    setEditedLine(songLines.currentLine);
    const segmentIndex = songLines.previousSegmentIndex;
    if (currentTrack.songText?.segments && segmentIndex >= 0 && songLines.currentLine) {
      setLineStart(currentTrack.songText.segments[segmentIndex].start ?? null);
      setLineEnd(currentTrack.songText.segments[segmentIndex].end ?? null);
    } else {
      setLineStart(null);
      setLineEnd(null);
    }
  }, [songLines.currentLine, isEditing]);

  const saveEditedLine = async () => {
    const segmentIndex = songLines.previousSegmentIndex >= 0 ? songLines.previousSegmentIndex : 0;
    const segments = currentTrack.songText?.segments || [];
    for (let i = 0; i < segments.length; i++) {
      if (i === segmentIndex) continue;

      const seg = segments[i];
      if (
        (lineStart >= seg.start && lineStart < seg.end) ||
        (lineEnd > seg.start && lineEnd <= seg.end) ||
        (lineStart < seg.start && lineEnd > seg.end)
      ) {
        alert(`The time range overlaps with segment ${i + 1}: "${seg.text}"`);
        return;
      }
    }

    if (currentTrack.songText?.segments && segmentIndex >= 0 && songLines.currentLine) {
      currentTrack.songText.segments[segmentIndex].text = editedLine || '';
      currentTrack.songText.segments[segmentIndex].start = lineStart;
      currentTrack.songText.segments[segmentIndex].end = lineEnd;
    }

    if (currentTrack.youtubeUrl != null) {
      const raw = await getItem(TRANSCRIPTIONS);
      let transcriptionsMap;
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        transcriptionsMap = new Map(Object.entries(parsed));
      } catch (err) {
        console.warn('Failed to parse transcriptions:', err);
        transcriptionsMap = new Map();
      }
      transcriptionsMap.set(currentTrack.youtubeUrl, currentTrack);
      setItem(TRANSCRIPTIONS, JSON.stringify(Object.fromEntries(transcriptionsMap)));
    }
    segments.sort((a, b) => a.start - b.start);
    setIsEditing(false);
  };

  const handleCancelPress = async () => {
    setIsEditing(false);
    const transcriptionsMap = await getTranscriptions();
    let storedTrack = null;
    if (currentTrack.youtubeUrl != null) {
      storedTrack = transcriptionsMap.get(currentTrack.youtubeUrl);
    }

    if (storedTrack && storedTrack.songText?.segments) {
      if (currentTrack.songText) {
        currentTrack.songText.segments = [...storedTrack.songText.segments];
      }
    }
    setEditedLine(songLines.currentLine || '');
    setLineStart(currentTrack.songText?.segments[songLines.previousSegmentIndex]?.start ?? null);
    setLineEnd(currentTrack.songText?.segments[songLines.previousSegmentIndex]?.end ?? null);
  };

  const handleReset = async () => {
    const transcriptionsMap = await getTranscriptions();
    if (currentTrack.youtubeUrl != null) {
      transcriptionsMap.delete(currentTrack.youtubeUrl);
      setItem(TRANSCRIPTIONS, JSON.stringify(Object.fromEntries(transcriptionsMap)));
      loadSong(currentTrack);
    }
    setIsEditing(false);
  };

  const addNewLine = async () => {
    const newLine = {
      start: Math.max(progress.position - 1, 0),
      end: progress.position,
      text: '',
    };
    currentTrack.songText?.segments.push(newLine);
    currentTrack.songText?.segments.sort((a, b) => a.start - b.start);
    const newIndex =
      currentTrack.songText?.segments.findIndex((segment) => segment === newLine) || -1;

    setSongLines({
      previousSegmentIndex: newIndex,
      previousLine: currentTrack.songText?.segments[newIndex - 1]?.text || null,
      currentLine: ' ',
      nextLine: currentTrack.songText?.segments[newIndex + 1]?.text || null,
    });
    setEditedLine(' ');
    setLineStart(newLine.start);
    setLineEnd(newLine.end);
  };

  const removeLine = async () => {
    const segmentIndex = songLines.previousSegmentIndex;
    if (segmentIndex < 0 || !currentTrack.songText?.segments) return;

    currentTrack.songText.segments.splice(segmentIndex, 1);

    const segments = currentTrack.songText.segments;
    if (segments.length === 0) {
      setSongLines({
        previousSegmentIndex: -1,
        previousLine: null,
        currentLine: null,
        nextLine: null,
      });
      setEditedLine('');
      return;
    }

    let newIndex = segmentIndex;
    if (newIndex >= segments.length) newIndex = segments.length - 1;
    if (newIndex < 0) newIndex = 0;

    setSongLines({
      previousSegmentIndex: newIndex,
      previousLine: segments[newIndex - 1]?.text || null,
      currentLine: segments[newIndex]?.text || null,
      nextLine: segments[newIndex + 1]?.text || null,
    });
    setEditedLine(segments[newIndex]?.text || '');
  };

  return {
    isEditing,
    editedLine,
    setEditedLine,
    lineStart,
    setLineStart,
    lineEnd,
    setLineEnd,
    handleEditPress,
    handleSavePress,
    handleCancelPress,
    handleReset,
    addNewLine,
    removeLine,
  };
};
