import { useEffect, useState } from "react";
import { TextInput, FlatList, Text, View, ActivityIndicator } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.length > 2) {
        setDebouncedSearch(searchValue);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchValue]);


  useEffect(() => {
    if (!debouncedSearch) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=Tamagotchi&type=video&maxResults=10&key=AIzaSyAcyaA3htasw-LLJQwBJvZzCbM2o6stE4s`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Błąd podczas wyszukiwania:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
        />
      }
    >
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
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>{item}</Text>
            </View>
          )}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}