import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTrackPlayer } from '@/context/trackPlayerContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SongViewText() {
  const {
    lineStart,
    lineEnd,
    addNewLine,
    handleReset,
    editedLine,
    setEditedLine,
    isEditing,
    handleEditPress,
    handleSavePress,
    handleCancelPress,
    songLines,
    setLineStart,
    setLineEnd,
    removeLine,
  } = useTrackPlayer();
  return (
    <View className="w-full h-full flex justify-center items-center bg-[#191414]">
      {!isEditing ? (
        <TouchableOpacity onPress={handleEditPress} className="absolute top-5 right-5 z-10">
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View className="absolute top-5 right-5 z-10 flex-row space-x-3">
          <TouchableOpacity onPress={handleSavePress}>
            <Ionicons name="checkmark-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelPress}>
            <Ionicons name="close-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      {isEditing && (
        <TouchableOpacity
          onPress={handleReset}
          className="absolute top-5 left-5 z-10 bg-[#333] px-3 py-1 rounded">
          <Text className="text-white text-sm">Reset to generated</Text>
        </TouchableOpacity>
      )}

      <View className="relative w-full flex justify-center items-center">
        <Text className="text-[22px] font-roboto-mono text-white text-center my-2 z-0">
          {songLines?.previousLine}
        </Text>
        <View className="absolute w-full h-full top-0 left-0 z-1 bg-gradient-to-b from-[rgba(25,20,20,1)] from-[75%_rgba(25,20,20,0.5)] to-[rgba(0,0,0,0)]" />
      </View>
      {isEditing && (
        <TouchableOpacity className="mb-1 p-1 rounded-full bg-[#333]" onPress={addNewLine}>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      )}
      {isEditing ? (
        editedLine !== null ? (
          <View className="flex-row items-center justify-center m-2 space-x-2">
            <View className="items-center">
              <Text className="text-xs text-white mb-1">Start</Text>
              <TextInput
                keyboardType="decimal-pad"
                value={
                  lineStart !== null && lineStart !== undefined && !isNaN(lineStart)
                    ? lineStart.toString()
                    : ''
                }
                className="text-[22px] font-roboto-mono text-lime text-center border border-white rounded px-2 py-1 bg-[#1e1e1e] w-full max-w-[100px]"
                placeholderTextColor="#ccc"
                onChangeText={(val) => setLineStart(parseInt(val))}
              />
            </View>

            <View className="flex-1 items-center">
              <Text className="text-xs text-white mb-1"> </Text>
              <TextInput
                value={editedLine}
                onChangeText={(text) => setEditedLine(text)}
                className="text-[22px] font-roboto-mono text-lime text-center border border-white rounded px-2 py-1 bg-[#1e1e1e] w-full max-w-[600px]"
              />
            </View>

            <View className="items-center">
              <Text className="text-xs text-white mb-1">End</Text>
              <TextInput
                keyboardType="decimal-pad"
                value={
                  lineEnd !== null && lineEnd !== undefined && !isNaN(lineEnd)
                    ? lineEnd.toString()
                    : ''
                }
                className="text-[22px] font-roboto-mono text-lime text-center border border-white rounded px-2 py-1 bg-[#1e1e1e] w-full max-w-[100px]"
                placeholderTextColor="#ccc"
                onChangeText={(val) => setLineEnd(parseFloat(val))}
              />
            </View>
            <TouchableOpacity
              className="ml-2 mt-8 mb-1 p-1 rounded-full bg-[#333]"
              onPress={removeLine}>
              <Ionicons name="remove-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : null
      ) : (
        <Text className="text-[22px] font-roboto-mono text-lime text-center my-2">
          {songLines?.currentLine}
        </Text>
      )}
      <View className="relative w-full flex justify-center items-center">
        <Text className="text-[22px] font-roboto-mono text-white text-center my-2 z-0">
          {songLines?.nextLine}
        </Text>
        <View className="absolute w-full h-full top-0 left-0 z-1 bg-gradient-to-t from-[rgba(25,20,20,1)] from-[75%_rgba(25,20,20,0.5)] to-[rgba(0,0,0,0)]" />
      </View>
    </View>
  );
}