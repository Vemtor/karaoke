import { useEffect, useState } from 'react';
import {
  TextInput,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SearchedVideo } from '@/KaraokeApp/searchEngine/searchedVideo';
import { mapToSearchedVideo } from '@/KaraokeApp/searchEngine/mapToSearchedVideo';

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [videos, setVideos] = useState<SearchedVideo[]>([]);
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    border: isDarkMode ? '#444444' : '#CCCCCC',
    placeholder: isDarkMode ? '#AAAAAA' : '#888888',
    inputBackground: isDarkMode ? '#333333' : '#FFFFFF',
    listItemSeparator: isDarkMode ? '#333333' : '#EEEEEE',
    activityIndicator: isDarkMode ? '#FFFFFF' : '#555555',
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.length > 2) {
        setDebouncedSearch(searchValue);
      } else if (searchValue.length <= 2) {
        setDebouncedSearch('');
        setVideos([]);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (!debouncedSearch) {
      setVideos([]);
      return;
    }

    const fetchData = async () => {
      setVideos([]);
      setLoading(true);
      try {
        const apiKey = 'AIzaSyAcyaA3htasw-LLJQwBJvZzCbM2o6stE4s';
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&videoEmbeddable=true&maxResults=10&key=${apiKey}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const mappedVideos: SearchedVideo[] = mapToSearchedVideo(data);
        setVideos(mappedVideos || []);
        console.log('Search result:', mappedVideos);
      } catch (err) {
        console.error('Error while searching', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: colors.background,
    },
    textInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginHorizontal: 20,
      marginBottom: 10,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    listItem: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.listItemSeparator,
    },
    listEmptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: colors.text,
      fontSize: 16,
    },
    activityIndicator: {
      marginVertical: 20,
    },
     titleText: {
        fontSize: 18,
        fontWeight: 'bold',
     },
     descriptionText: {
        fontSize: 14,
        marginTop: 4,
     }
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Enter song title here."
        placeholderTextColor={colors.placeholder}
        onChangeText={setSearchValue}
        value={searchValue}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.listContainer}>
        {loading && (
          <ActivityIndicator
             size="large"
             color={colors.activityIndicator}
             style={styles.activityIndicator}
           />
        )}
        <FlatList
          data={videos}
          keyExtractor={(video) => video.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <ThemedText style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">{item.title}</ThemedText>
              <ThemedText style={styles.descriptionText} numberOfLines={2} ellipsizeMode="tail">{item.description}</ThemedText>
            </View>
          )}
          ListEmptyComponent={
            !loading && debouncedSearch ? (
                 <Text style={styles.listEmptyText}>No results for "{debouncedSearch}"</Text>
            ) : null
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </View>
    </View>
  );
}
// import React from 'react';
// import global from '@/styles/global';
// import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

// const HomeScreen = () => {
//   return (
//     <SafeAreaView style={global['safe-area-container']}>
//       <View style={styles.container}>
//         <Text style={styles.text}>Search</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

// export default HomeScreen;
// >>>>>>> origin/develop
