import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import {SearchedVideo} from "@/components/utils/searchEngine/searchedVideo";
import colors from "@/constants/colors";


const SongTile: React.FC<SearchedVideo> = (searchedVideo) => {
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <View style={styles.rectangle}>
          <ImageBackground
            source={{ uri: searchedVideo.thumbnailUrl }}
            style={styles.image}
            imageStyle={{ borderRadius: 5 }}
          />
          <View style={styles.tileContent}>
            <Text style={styles.titleText}>{searchedVideo.title}</Text>
            <Text style={styles.channelName}>{searchedVideo.channelTitle}</Text>
            <Text style={styles.durationText}>{searchedVideo.formattedDuration}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tile: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  rectangle: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  tileContent: {
    marginLeft: 20,
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  channelName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: colors.durationText,
  },
});

export default SongTile;
