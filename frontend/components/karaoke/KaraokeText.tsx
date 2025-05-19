import { View, Text } from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';

export default function SongViewText() {
  const { songLines } = useTrackPlayer();
  return (
    <View className="w-full h-full flex justify-center items-center bg-[#191414]">
      <View className="relative w-full flex justify-center items-center">
        <Text className="text-[22px] font-roboto-mono text-white text-center my-2 z-0">
          {songLines.previousLine}
        </Text>
        <View className="absolute w-full h-full top-0 left-0 z-1 bg-gradient-to-b from-[rgba(25,20,20,1)] from-[75%_rgba(25,20,20,0.5)] to-[rgba(0,0,0,0)]" />
      </View>
      <Text className="text-[22px] font-roboto-mono text-[#95E558] text-center my-2">
        {songLines.currentLine}
      </Text>
      <View className="relative w-full flex justify-center items-center">
        <Text className="text-[22px] font-roboto-mono text-white text-center my-2 z-0">
          {songLines.nextLine}
        </Text>
        <View className="absolute w-full h-full top-0 left-0 z-1 bg-gradient-to-t from-[rgba(25,20,20,1)] from-[75%_rgba(25,20,20,0.5)] to-[rgba(0,0,0,0)]" />
      </View>
    </View>
  );
};
//   return (
//     <View style={styles.container}>
//       <View style={styles.lineContainer}>
//         <Text style={[styles.line]}>{songLines.previousLine}</Text>
//         <View style={[styles.tint, styles.tintTop]} />
//       </View>
//       <Text style={[styles.line, styles.highlighted]}>{songLines.currentLine}</Text>
//       <View style={styles.lineContainer}>
//         <Text style={[styles.line]}>{songLines.nextLine}</Text>
//         <View style={[styles.tint, styles.tintBottom]} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#191414',
//   },
//   lineContainer: {
//     position: 'relative',
//     width: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   line: {
//     fontSize: 24,
//     color: 'white',
//     textAlign: 'center',
//     marginVertical: 8,
//     zIndex: 0,
//   },
//   highlighted: {
//     color: '#95E558',
//   },
//   tint: {
//     width: '100%',
//     position: 'absolute',
//     height: '100%',
//     top: 0,
//     left: 0,
//     zIndex: 1,
//   },
//   tintTop: {
//     backgroundImage:
//       'linear-gradient(to bottom, rgba(25, 20, 20, 1) 0%,rgba(25, 20, 20, 0.5) 75%, rgba(0, 0, 0, 0) 100%)',
//   },
//   tintBottom: {
//     backgroundImage:
//       'linear-gradient(to top, rgba(25, 20, 20, 1) 0%, rgba(25, 20, 20, 0.5) 75%, rgba(0, 0, 0, 0) 100%)',
//   },
// });
