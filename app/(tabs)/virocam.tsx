import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ViroARSceneNavigator, ViroARScene, ViroImage } from '@viro-community/react-viro';
import { Ionicons } from '@expo/vector-icons';

const InitialARScene = () => {
    return (
        <ViroARScene>
            <ViroImage
                source={require('@/assets/flower.png')} // replace with your PNG
                position={[0, 0, -1]} // 1 meter in front of the camera
                scale={[0.5, 0.5, 0.5]}
            />
        </ViroARScene>
    );
};

export default function CameraWithViro() {
    const [showControls, setShowControls] = useState(true);

    return (
        <View style={styles.container}>
            <ViroARSceneNavigator
                initialScene={{ scene: InitialARScene }}
                style={styles.viro}
            />

            {showControls && (
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={() => setShowControls(false)} style={styles.iconButton}>
                        <Ionicons name="eye-off" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    viro: { flex: 1 },
    bottomBar: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
    },
    iconButton: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
});
