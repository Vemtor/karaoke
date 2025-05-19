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
  TouchableOpacity,
} from 'react-native';
import {SearchedVideo} from "@/utils/searchEngine/searchedVideo";
import {mapToSearchedVideo} from "@/utils/searchEngine/mapToSearchedVideo";
import { Ionicons } from '@expo/vector-icons';
import { parseISO8601Duration} from "@/utils/searchEngine/durationParser";
import colors from "@/constants/colors";
import { useTrackPlayer } from '@/context/trackPlayerContext';

export default function SearchScreen() {
  const apiKey = process.env.EXPO_PUBLIC_SEARCH_APP_API_KEY;

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [videos, setVideos] = useState<SearchedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const { loadSong } = useTrackPlayer();

  const fetchVideoDetails = async (videoIds: string[]): Promise<Map<string, string>> => {
    if (videoIds.length === 0) {
      return new Map();
    }
    const idsString = videoIds.join(',');
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${idsString}&key=${apiKey}`
    );
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status} while fetching video details for IDs: ${idsString}`);
      return new Map();
    }
    const data = await res.json();
    const durationsMap = new Map<string, string>();
    data.items?.forEach((item: any) => {
      if (item.id && item.contentDetails?.duration) {
        durationsMap.set(item.id, item.contentDetails.duration);
      }
    });
    return durationsMap;
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

    const fetchInitialDataAndDetails = async () => {
      setLoading(true);
      setVideos([]);
      setNextPageToken(null);
      try {
        const searchRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&videoEmbeddable=true&maxResults=10&key=${apiKey}`
        );
        if (!searchRes.ok) {
          throw new Error(`Search API HTTP error! status: ${searchRes.status}`);
        }
        const searchData = await searchRes.json();

        let mappedInitialVideos: SearchedVideo[] = mapToSearchedVideo(searchData);

        const videoIds = mappedInitialVideos.map(v => v.id).filter(id => id);
        if (videoIds.length > 0) {
          const durationsMap = await fetchVideoDetails(videoIds);
          mappedInitialVideos = mappedInitialVideos.map(video => {
            const rawDur = durationsMap.get(video.id);
            video.rawDuration = rawDur;
            video.formattedDuration = parseISO8601Duration(rawDur);
            return video;
          });
        }

        setVideos(mappedInitialVideos);
        setNextPageToken(searchData.nextPageToken || null);
      } catch (err) {
        console.error('Error in fetchInitialDataAndDetails:', err);
        setVideos([]);
        setNextPageToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialDataAndDetails();
  }, [debouncedSearch]);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore || loading) {
      return;
    }
    setLoadingMore(true);
    try {
      const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&videoEmbeddable=true&maxResults=10&key=${apiKey}&pageToken=${nextPageToken}`
      );
      if (!searchRes.ok) {
        throw new Error(`Search API (load more) HTTP error! status: ${searchRes.status}`);
      }
      const searchData = await searchRes.json();

      let newMappedVideos: SearchedVideo[] = mapToSearchedVideo(searchData);

      const videoIds = newMappedVideos.map(v => v.id).filter(id => id);
      if (videoIds.length > 0) {
        const durationsMap = await fetchVideoDetails(videoIds);
        newMappedVideos = newMappedVideos.map(video => {
          const rawDur = durationsMap.get(video.id);
          video.rawDuration = rawDur;
          video.formattedDuration = parseISO8601Duration(rawDur);
          return video;
        });
      }

      setVideos(prevVideos => [...prevVideos, ...newMappedVideos]);
      setNextPageToken(searchData.nextPageToken || null);
    } catch (err) {
      console.error('Error in handleLoadMore:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
        <View style={styles.footerActivityIndicator}>
          <ActivityIndicator size="small" color={colors.activityIndicator} />
        </View>
    );
  };

  const renderVideoItem = ({ item }: { item: SearchedVideo }) => (
      <TouchableOpacity style={styles.listItem}
                        onPress={async () => {
                          console.log('Item clicked:', item.title);
                          console.log('Video URL:', item.videoUrl);
                          console.log('Raw Duration:', item.rawDuration);
                          console.log('Formatted Duration:', item.formattedDuration);
                          const songTrack = {
                            title: item.title,
                            youtubeUrl: item.videoUrl,
                            url: '',
                            thumbnailUrl: item.thumbnailUrl
                          }
                          await loadSong(songTrack)
                        }}
                        activeOpacity={0.7}
      >
        {item.thumbnailUrl && (
            <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.thumbnail}
            />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.descriptionText} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
          <Text style={styles.durationText} numberOfLines={1}>{item.formattedDuration}</Text>
        </View>
      </TouchableOpacity>
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
              <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator size="large" color={colors.activityIndicator} />
              </View>
          ) : (
              <FlatList
                  contentContainerStyle={styles.listContainerFlatList}
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


const isDarkMode = true;
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
    color: colors.inputIconLight,
  },
  listContainerFlatList: {
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
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: colors.durationText,
  },
  listEmptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: colors.text,
    fontSize: 16,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerActivityIndicator: {
    paddingVertical: 20,
  },
}), [isDarkMode]);
