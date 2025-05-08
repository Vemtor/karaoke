import { useEffect, useState, useMemo } from 'react';
import {
  TextInput,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { SearchedVideo } from '@/KaraokeApp/searchEngine/searchedVideo';
import { mapToSearchedVideo } from '@/KaraokeApp/searchEngine/mapToSearchedVideo';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const apiKey = process.env.EXPO_PUBLIC_SEARCH_APP_API_KEY;

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [videos, setVideos] = useState<SearchedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const isDarkMode = true;

  const colors = {
    background: '#161616',
    text: '#FFFFFF',
    border: '#555555',
    inputBackgroundLight: '#FFFFFF',
    inputTextLight: '#000000',
    inputPlaceholderLight: '#8A8A8F',
    inputIconLight: '#3C3C43',
    listItemBackground: '#2C2C2E',
    activityIndicator: '#FFFFFF',
    placeholder: '#999999',
    listItemSeparator: '#161616',
    icon: '#FFFFFF',
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.length > 2) {
        setDebouncedSearch(searchValue);
      } else if (searchValue.length <= 2) {
        setDebouncedSearch('');
        setVideos([]);
        setNextPageToken(null);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (!debouncedSearch) {
      setVideos([]);
      setNextPageToken(null);
      return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      setVideos([]);
      setNextPageToken(null);
      try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&videoEmbeddable=true&maxResults=10&key=${apiKey}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const mappedVideos: SearchedVideo[] = mapToSearchedVideo(data);
        setVideos(mappedVideos || []);
        setNextPageToken(data.nextPageToken || null);
      } catch (err) {
        setVideos([]);
        setNextPageToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [debouncedSearch]);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore || loading) {
      return;
    }
    setLoadingMore(true);
    try {
      const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&videoEmbeddable=true&maxResults=10&key=${apiKey}&pageToken=${nextPageToken}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const newVideos: SearchedVideo[] = mapToSearchedVideo(data);
      setVideos(prevVideos => [...prevVideos, ...newVideos]);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error('Error while loading more videos', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    mainText: {
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '600',
      color: colors.text,
      marginVertical: 15,
    },
    inputContainer: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackgroundLight,
      borderRadius: 10,
      marginHorizontal: 15,
      marginBottom: 20,
      paddingHorizontal: 10,
      height: 48,
    },
    textInput: {
      flex: 1,
      height: '100%',
      color: colors.inputTextLight,
      fontSize: 17,
      paddingLeft: 8,
    },
    searchIcon: {
      color: colors.inputIconLight
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: 15,
    },
    listItem: {
      flexDirection: 'row',
      backgroundColor: colors.listItemBackground,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      alignItems: 'center',
    },
    thumbnail: {
      width: 80,
      height: 80,
      marginRight: 12,
      borderRadius: 6,
      backgroundColor: '#555',
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    titleText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 3,
    },
    descriptionText: {
      fontSize: 14,
      color: colors.text,
    },
    listEmptyText: {
      textAlign: 'center',
      marginTop: 50,
      color: colors.text,
      fontSize: 16,
    },
    activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerActivityIndicator: {
      paddingVertical: 20,
    },
  }), [isDarkMode]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
        <View style={styles.footerActivityIndicator}>
          <ActivityIndicator size="small" color={colors.activityIndicator} />
        </View>
    );
  };

  const renderVideoItem = ({ item }: { item: SearchedVideo }) => (
      <View style={styles.listItem}>
        {item.thumbnailUrl && (
            <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.thumbnail}
            />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.descriptionText} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
        </View>
      </View>
  );

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1 }}>

          <View style={styles.inputContainer}>
            <Ionicons
                name="search"
                size={20}
                color={colors.inputIconLight}
                style={{ marginRight: 6 }}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={colors.inputPlaceholderLight}
                onChangeText={setSearchValue}
                value={searchValue}
                clearButtonMode="while-editing"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={() => {
                  if (searchValue.length > 2) {
                    setDebouncedSearch(searchValue);
                  }
                }}
            />
          </View>

          {loading && videos.length === 0 ? (
              <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" color={colors.activityIndicator} />
              </View>
          ) : (
              <FlatList
                  contentContainerStyle={styles.listContainer}
                  data={videos}
                  keyExtractor={(video) => video.id}
                  renderItem={renderVideoItem}
                  ListEmptyComponent={
                    !loading && !loadingMore && debouncedSearch && videos.length === 0 ? (
                        <Text style={styles.listEmptyText}>No results for "{debouncedSearch}"</Text>
                    ) : null
                  }
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.7}
                  ListFooterComponent={renderFooter}
                  keyboardShouldPersistTaps="handled"
              />
          )}
        </View>
      </SafeAreaView>
  );
}