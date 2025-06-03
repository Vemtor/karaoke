import { useEffect, useState, useMemo, useCallback } from 'react';
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
import { SearchedVideo } from '@/utils/searchEngine/searchedVideo';
import { mapToSearchedVideo } from '@/utils/searchEngine/mapToSearchedVideo';
import { Ionicons } from '@expo/vector-icons';
import { parseISO8601Duration } from '@/utils/searchEngine/durationParser';
import colors from '@/constants/colors';
import useSelectedTileStore from '@/stores/selected-tile.store';
import { ImageTileProps } from '@/components/tiles/types/image-tile';
import { TileModalVariant } from '@/components/modals/types/tile-modal.enum';
import TileModal from '@/components/modals/tile-modal';

export default function SearchScreen() {
  const apiKey = process.env.EXPO_PUBLIC_SEARCH_APP_API_KEY;

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [videos, setVideos] = useState<SearchedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const setVisible = useSelectedTileStore((state) => state.setVisible);
  const setVariant = useSelectedTileStore((state) => state.setVariant);
  const setTileData = useSelectedTileStore((state) => state.setTileData);
  const setSongTrack = useSelectedTileStore((state) => state.setSongTrack);
  const setSearchedVideo = useSelectedTileStore((state) => state.setSearchedVideo);
  const tileData = useSelectedTileStore((state) => state.tileData);

  const openTileModal = useCallback(
    (tile: ImageTileProps, variant: TileModalVariant, searchedVideo: SearchedVideo) => {
      setTileData(tile);
      setVisible(true);
      setVariant(variant);
      setSongTrack(null);
      setSearchedVideo(searchedVideo);
    },
    [setTileData, setVisible, setVariant, setSongTrack, setSearchedVideo],
  );

  const fetchVideoDetails = async (videoIds: string[]): Promise<Map<string, string>> => {
    if (videoIds.length === 0) {
      return new Map();
    }
    const idsString = videoIds.join(',');
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${idsString}&key=${apiKey}`,
    );
    if (!res.ok) {
      console.error(
        `HTTP error! status: ${res.status} while fetching video details for IDs: ${idsString}`,
      );
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
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&videoEmbeddable=true&maxResults=10&key=${apiKey}`,
        );
        if (!searchRes.ok) {
          throw new Error(`Search API HTTP error! status: ${searchRes.status}`);
        }
        const searchData = await searchRes.json();

        let mappedInitialVideos: SearchedVideo[] = mapToSearchedVideo(searchData);

        const videoIds = mappedInitialVideos.map((v) => v.id).filter((id) => id);
        if (videoIds.length > 0) {
          const durationsMap = await fetchVideoDetails(videoIds);
          mappedInitialVideos = mappedInitialVideos.map((video) => {
            const rawDur = durationsMap.get(video.id);
            video.rawDuration = rawDur;
            video.formattedDuration = parseISO8601Duration(rawDur);
            // Add the missing videoUrl property
            video.videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
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
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&videoEmbeddable=true&maxResults=10&key=${apiKey}&pageToken=${nextPageToken}`,
      );
      if (!searchRes.ok) {
        throw new Error(`Search API (load more) HTTP error! status: ${searchRes.status}`);
      }
      const searchData = await searchRes.json();

      let newMappedVideos: SearchedVideo[] = mapToSearchedVideo(searchData);

      const videoIds = newMappedVideos.map((v) => v.id).filter((id) => id);
      if (videoIds.length > 0) {
        const durationsMap = await fetchVideoDetails(videoIds);
        newMappedVideos = newMappedVideos.map((video) => {
          const rawDur = durationsMap.get(video.id);
          video.rawDuration = rawDur;
          video.formattedDuration = parseISO8601Duration(rawDur);
          // Add the missing videoUrl property
          video.videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
          return video;
        });
      }

      setVideos((prevVideos) => [...prevVideos, ...newMappedVideos]);
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
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        openTileModal(
          {
            id: item.id,
            title: item.title,
            subtitle: item.channelTitle,
            image: item.thumbnailUrl,
          },
          TileModalVariant.NEW_SONG,
          item,
        )
      }>
      {item.thumbnailUrl && <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />}
      <View style={styles.textContainer}>
        <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.descriptionText} numberOfLines={1} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Text style={styles.durationText} numberOfLines={1}>
          {item.formattedDuration}
        </Text>
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

      {/* Add TileModal */}
      {tileData && <TileModal />}
    </SafeAreaView>
  );
}

const isDarkMode = true;
const styles = useMemo(
  () =>
    StyleSheet.create({
      activityIndicatorContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      },
      descriptionText: {
        color: colors.text,
        fontSize: 14,
        marginBottom: 4,
      },
      durationText: {
        color: colors.durationText,
        fontSize: 12,
      },
      footerActivityIndicator: {
        paddingVertical: 20,
      },
      inputContainer: {
        alignItems: 'center',
        backgroundColor: colors.inputBackgroundLight,
        borderRadius: 10,
        flexDirection: 'row',
        height: 48,
        marginBottom: 20,
        marginHorizontal: 15,
        marginTop: 20,
        paddingHorizontal: 10,
      },
      listContainerFlatList: {
        paddingHorizontal: 15,
      },
      listEmptyText: {
        color: colors.text,
        fontSize: 16,
        marginTop: 50,
        textAlign: 'center',
      },
      listItem: {
        alignItems: 'center',
        backgroundColor: colors.listItemBackground,
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 12,
        padding: 12,
      },
      mainText: {
        color: colors.text,
        fontSize: 22,
        fontWeight: '600',
        marginVertical: 15,
        textAlign: 'center',
      },
      searchIcon: {
        color: colors.inputIconLight,
      },
      textContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      textInput: {
        color: colors.inputTextLight,
        flex: 1,
        fontSize: 17,
        height: '100%',
        paddingLeft: 8,
      },
      thumbnail: {
        backgroundColor: '#555',
        borderRadius: 6,
        height: 80,
        marginRight: 12,
        width: 80,
      },
      titleText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 3,
      },
    }),
  [isDarkMode],
);
