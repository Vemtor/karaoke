import React from 'react';
import global from '@/styles/global';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={global['safe-area-container']}>
      <View style={styles.container}>
        <Text style={styles.text}>Queue</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default HomeScreen;
