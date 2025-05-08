import React from "react";
import { ProgressBarAndroidComponent, View } from "react-native";
import { Text } from "react-native";
// import TrackPlayer, { State } from 'react-native-track-player';
import TrackPlayer, { useProgress } from 'react-native-track-player';


export default function SongSpinner() {
    const progress = useProgress();

    return (
            // Note: formatTime and ProgressBar are just examples:
            <>
                <View>
                    <Text>Elapsed Time: {Math.floor(progress.position)}s</Text>
                    <View style={{ height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' }}>
                        <View
                            style={{
                                height: '100%',
                                width: `${(progress.position / progress.duration) * 100}%`,
                                backgroundColor: '#3b5998',
                            }} />
                    </View>
                </View>
            </>
        );
};