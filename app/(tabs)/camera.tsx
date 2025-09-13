import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import RNSketchCanvas, { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isDrawing, setIsDrawing] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Entypo name="pencil" size={36} color="black" onPress={setIsDrawing}/>
            </View>
            {/*<View>*/}
            {/*    {isDrawing &&*/}
            {/*        <SketchCanvas style={{flex: 1}} strokeColor={'black'} strokeWidth={4} />*/}
            {/*    }*/}
            {/*</View>*/}
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <RNSketchCanvas
                    containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
                    canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                    defaultStrokeIndex={0}
                    defaultStrokeWidth={5}
                    closeComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Close</Text></View>}
                    undoComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Undo</Text></View>}
                    clearComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Clear</Text></View>}
                    eraseComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Eraser</Text></View>}
                    strokeComponent={color => (
                        <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                    )}
                    strokeSelectedComponent={(color, index, changed) => {
                        return (
                            <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                        )
                    }}
                    strokeWidthComponent={(w) => {
                        return (<View style={styles.strokeWidthButton}>
                                <View  style={{
                                    backgroundColor: 'white', marginHorizontal: 2.5,
                                    width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                                }} />
                            </View>
                        )}}
                    saveComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Save</Text></View>}
                    savePreference={() => {
                        return {
                            folder: 'RNSketchCanvas',
                            filename: String(Math.ceil(Math.random() * 100000000)),
                            transparent: false,
                            imageType: 'png'
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    strokeColorButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
        backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
    }
});
