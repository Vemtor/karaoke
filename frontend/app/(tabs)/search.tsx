import { useEffect, useState } from "react";
import { TextInput, FlatList, Text, View, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchedVideo } from "@/KaraokeApp/searchEngine/searchedVideo";
import { mapToSearchedVideo } from "@/KaraokeApp/searchEngine/mapToSearchedVideo";

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [videos, setVideos] = useState<SearchedVideo[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.length > 2) {
        setDebouncedSearch(searchValue);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue]);


  useEffect(() => {
    if (!debouncedSearch) return;

    const fetchData = async () => {
      setVideos([]);
      setLoading(true);
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${debouncedSearch}&type=video&maxResults=10&key=AIzaSyAcyaA3htasw-LLJQwBJvZzCbM2o6stE4s`);
        const data = await res.json();
        const videos: SearchedVideo[] = mapToSearchedVideo(data);
        setVideos(videos || []);
        console.log("Wyniki wyszukiwania:", videos);
      } catch (err) {
        console.error("Błąd podczas wyszukiwania:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch]);

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
          margin: 20,
        }}
        placeholder="Type to search"
        onChangeText={setSearchValue}
        value={searchValue}
      />

      <ThemedView>
        <ThemedText type="title">Search</ThemedText>

        {loading && <ActivityIndicator size="small" color="#555" style={{ marginVertical: 10 }} />}
        <FlatList
          data={videos}
          keyExtractor={(video) => video.id}
          renderItem={({ item }) => (
            <View style={{ padding: 10, margin: 1, borderWidth: 1, borderBottomColor: "#ccc" }}>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No results found</Text>}
        />
      </ThemedView>
    </View>
  );
}