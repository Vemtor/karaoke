import { useTrackPlayer } from "@/context/trackPlayerContext";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";


export default function Controls() {
    const { playNextSong, toggleSong, playPreviousSong, isPlaying } = useTrackPlayer();
    return (
    <View className="flex flex-row justify-around items-center w-full pb-2">
        <TouchableOpacity className="items-center" onPress={playPreviousSong}>
            <SkipBack size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={toggleSong}>
            {isPlaying ? <Pause size={32} color="black" /> : <Play size={32} color="black" />}
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={playNextSong}>
            <SkipForward size={32} color="black" />
        </TouchableOpacity>
    </View>
  )
}