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
