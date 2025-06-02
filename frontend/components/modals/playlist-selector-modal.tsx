import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput,
    Alert,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import usePlaylistStore, { Playlist } from '@/stores/playlist.store';
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';
import colors from '@/constants/colors';

interface PlaylistSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    song: SearchedVideo;
}

const PlaylistSelectorModal: React.FC<PlaylistSelectorModalProps> = ({
                                                                         visible,
                                                                         onClose,
                                                                         song,
                                                                     }) => {
    const { playlists, createPlaylist, addSongToPlaylist } = usePlaylistStore();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

    const handleCreatePlaylist = () => {
        if (!newPlaylistName.trim()) {
            Alert.alert('Error', 'Please enter a playlist name');
            return;
        }

        const playlistId = createPlaylist(
            newPlaylistName.trim(),
            newPlaylistDescription.trim(),
            song.thumbnailUrl // Use the song's thumbnail as default playlist image
        );

        addSongToPlaylist(playlistId, song);

        setNewPlaylistName('');
        setNewPlaylistDescription('');
        setShowCreateForm(false);
        onClose();

        Alert.alert('Success', `Song added to new playlist "${newPlaylistName}"`);
    };

    const handleAddToExistingPlaylist = (playlist: Playlist) => {
        // Check if song already exists in playlist
        const songExists = playlist.songs.some(existingSong => existingSong.id === song.id);

        if (songExists) {
            Alert.alert('Info', `This song is already in "${playlist.name}"`);
            return;
        }

        addSongToPlaylist(playlist.id, song);
        onClose();
        Alert.alert('Success', `Song added to "${playlist.name}"`);
    };

    const renderPlaylistItem = ({ item }: { item: Playlist }) => (
        <TouchableOpacity
            style={{
        flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: colors.listItemBackground,
            borderRadius: 8,
            marginBottom: 8,
    }}
    onPress={() => handleAddToExistingPlaylist(item)}
>
    <Image
        source={{ uri: item.image || song.thumbnailUrl }}
    style={{
        width: 50,
            height: 50,
            borderRadius: 6,
            backgroundColor: '#555',
            marginRight: 12,
    }}
    />
    <View style={{ flex: 1 }}>
    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
    {item.name}
    </Text>
    <Text style={{ color: colors.text, fontSize: 14, opacity: 0.7 }}>
    {item.songs.length} songs
    </Text>
    </View>
    <Ionicons name="add-circle-outline" size={24} color={colors.text} />
    </TouchableOpacity>
);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
    <TouchableWithoutFeedback onPress={() => {}}>
    <View
        style={{
        backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80%',
            paddingTop: 20,
    }}
>
    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
    Add to Playlist
    </Text>
    <TouchableOpacity onPress={onClose}>
    <Ionicons name="close" size={24} color={colors.text} />
    </TouchableOpacity>
    </View>

    {/* Song info */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 12, backgroundColor: colors.listItemBackground, borderRadius: 8 }}>
    <Image
        source={{ uri: song.thumbnailUrl }}
    style={{ width: 50, height: 50, borderRadius: 6, marginRight: 12, backgroundColor: '#555' }}
    />
    <View style={{ flex: 1 }}>
    <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
        {song.title}
        </Text>
        <Text style={{ color: colors.text, fontSize: 12, opacity: 0.7 }} numberOfLines={1}>
        {song.channelTitle}
        </Text>
        </View>
        </View>

    {/* Create new playlist button */}
    <TouchableOpacity
        style={{
        flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: colors.inputBackgroundLight,
            borderRadius: 8,
            marginBottom: 16,
    }}
    onPress={() => setShowCreateForm(!showCreateForm)}
>
    <Ionicons name="add-circle" size={24} color={colors.text} style={{ marginRight: 12 }} />
    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
    Create New Playlist
    </Text>
    </TouchableOpacity>

    {/* Create playlist form */}
    {showCreateForm && (
        <View style={{ marginBottom: 16 }}>
        <TextInput
            style={{
        backgroundColor: colors.inputBackgroundLight,
            color: colors.inputTextLight,
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            fontSize: 16,
    }}
        placeholder="Playlist name"
        placeholderTextColor={colors.inputPlaceholderLight}
        value={newPlaylistName}
        onChangeText={setNewPlaylistName}
        />
        <TextInput
        style={{
        backgroundColor: colors.inputBackgroundLight,
            color: colors.inputTextLight,
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 16,
            minHeight: 80,
    }}
        placeholder="Description (optional)"
        placeholderTextColor={colors.inputPlaceholderLight}
        value={newPlaylistDescription}
        onChangeText={setNewPlaylistDescription}
        multiline
        textAlignVertical="top"
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
            style={{
        flex: 1,
            backgroundColor: colors.activityIndicator,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
    }}
        onPress={handleCreatePlaylist}
        >
        <Text style={{ color: 'white', fontWeight: '600' }}>Create & Add</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={{
        flex: 1,
            backgroundColor: colors.inputBackgroundLight,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
    }}
        onPress={() => setShowCreateForm(false)}
    >
        <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
    </TouchableOpacity>
    </View>
    </View>
    )}

    {/* Existing playlists */}
    {playlists.length > 0 && (
        <>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
        Your Playlists
    </Text>
    <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 300 }}
        />
        </>
    )}

    {playlists.length === 0 && !showCreateForm && (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Text style={{ color: colors.text, opacity: 0.7, fontSize: 16 }}>
        No playlists yet
    </Text>
    <Text style={{ color: colors.text, opacity: 0.5, fontSize: 14 }}>
        Create your first playlist above
    </Text>
    </View>
    )}
    </View>
    </View>
    </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
    </Modal>
);
};

export default PlaylistSelectorModal;