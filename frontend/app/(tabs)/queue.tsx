<<<<<<< HEAD
import React, {useEffect, useState} from 'react';
import global from '@/styles/global';
import {StyleSheet, SafeAreaView, Dimensions, FlatList} from 'react-native';
import QueueService from "@/utils/queueService";
import {SearchedVideo} from "@/components/utils/searchEngine/searchedVideo";
import SongTile from "@/components/SongTile";
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [queue, setQueue] = useState<SearchedVideo[]>([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const data = QueueService.getShiftedQueue();
        setQueue(data);
      } catch (err) {
        console.error('Failed to fetch queue:', err);
      }
    };

    fetchQueue().catch(console.error);

    const interval = setInterval(() => {
      fetchQueue().catch(console.error);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={global['safe-area-container']}>
      <FlatList
        contentContainerStyle={styles.listContainerFlatList}
        data={queue}
        renderItem={({ item }) => <SongTile {...item} />}
        keyExtractor={(item, index) => item.id || index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainerFlatList: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  songTile: {
    marginHorizontal: width * 0.04,
    marginVertical: 10,
  },
  tile: {
    position: 'relative',
    height: 100,
  },
  rectangle: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 80,
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  tileContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  artist: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
=======
import React from 'react';
import { Text, View } from 'react-native';

import ViewLayout from '@/components/wrappers/view-laytout';

const Queue = () => {
  return (
    <ViewLayout>
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-[24px] font-bold font-roboto-mono">Queue</Text>
      </View>
    </ViewLayout>
  );
};

export default Queue;
>>>>>>> develop
