// App.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import ExpoAROverlay from '@/lib/ExpoAROverlay';

export default function Vcam() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) return <View style={styles.container} />;
    if (!permission.granted) {
        requestPermission();
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>
            <CameraView style={StyleSheet.absoluteFill} facing={facing}>
                <ExpoAROverlay blobSource={require('../../assets/flower.png')} />
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});
