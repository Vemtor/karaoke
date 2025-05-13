import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { useProgress } from 'react-native-track-player';

export default function SongSpinner() {
    const progress = useProgress();
    
    return (
            <>
                <View>
                    <Text>Elapsed Time: {Math.floor(progress.position)}/{Math.floor(progress.duration)}s</Text>
                    <View style={{ height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' }}>
                        <View
                            style={{
                                height: '100%',
                                width: `${progress.duration > 0 ? (progress.position / progress.duration) : 0 * 100}%`,
                                backgroundColor: '#3b5998',
                            }} />
                    </View>
                </View>
            </>
        );
};