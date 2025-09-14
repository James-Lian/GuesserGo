// satellite image of somewhere between x km
// user has to get to the location and take a picture which is x% similar
// geoguessr style rounds and points system, micro scale

import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Pressable, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons, Entypo } from '@expo/vector-icons';
import FingerDrawing from '@/components/FingerDrawing';
import LocationImageOverlay from "@/components/ImagePopUp";
import GameUI from "@/components/GameUI";
import { uploadUri } from '@/lib/firebaseStorage';
import { useGlobals } from '@/lib/useGlobals';

import * as Location from "expo-location";

export default function Camera({ defaultColor = '#ff0000' }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isDrawing, setIsDrawing] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [photoUri, setPhotoUri] = useState("");

    const { joined, hostOrNo, imagesData, setImagesData, svgVar } = useGlobals();

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.centered}>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Ionicons name="camera" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const toggleFacing = () => setFacing((f) => (f === 'back' ? 'front' : 'back'));
    
    const takePhoto = async () => {
        if (joined && hostOrNo) {
            setIsDrawing(true);
            const photo = await cameraRef.current?.takePictureAsync();
            const photoUri = photo?.uri;
            console.log(photoUri);
            if (photoUri) {   
                setPhotoUri(photoUri);
            }
            setPhotoModalVisible(true);
        } else {
            Alert.alert("You must be a host of your own room to add photos. ", "If you haven't done so already, please create your own room!", [{ text: 'OK'}]);
        }
    }

    const handleModalClose = () => {
        setPhotoModalVisible(false);
        setIsDrawing(false);
    }

    return (
        <>
            <View style={styles.container}>
                <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
                {/* <LocationImageOverlay
                    targetLat={43.47260261491713}
                    targetLon={-80.53998}
                    radius={100}
                    imageSource={require('../../assets/flower.png')}
                    onPress={handleImagePress}
                /> */}
                

                {/* Camera controls separate from drawing controls */}
                {!isDrawing && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={toggleFacing} style={styles.iconButton}>
                            <Ionicons name="camera-reverse" size={28} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => takePhoto()} style={styles.iconButton}>
                            <Ionicons name="camera" size={28} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
                            <Entypo name="image" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                {/* <GameUI /> */}
            </View>
            <Modal
                animationType='slide'
                transparent={true}
                visible={photoModalVisible}
                onRequestClose={() => {
                    handleModalClose();
                }}
            >
                <Pressable className="flex flex-1 justify-center items-center bg-[#00000099] p-[12px]" onPress={() => {handleModalClose()}}>
                    <View className="bg-white w-full h-[80%] py-[20px] px-[12px]" style={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}>
                        <Text>Confirm your photo and draw a badge!</Text>
                        <Image src={photoUri} style={{ flex: 1 }} resizeMode="contain" />
                        {isDrawing && (
                            <View style={styles.overlay} pointerEvents="box-none">
                                <FingerDrawing />
                            </View>
                        )}
                        <View className="flex flex-row">
                            <TouchableOpacity 
                                className="flex-1" 
                                onPress={() => {
                                    handleModalClose();
                                }} 
                                disabled={buttonsDisabled}
                                style={styles.iconButton}
                            >
                                <Ionicons name="close-circle" size={28} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="flex-1" 
                                onPress={async () => {
                                    setButtonsDisabled(true);
                                    const dwnloadLink = await uploadUri(photoUri);
                                    const location = await Location.getCurrentPositionAsync({});
                                    let newImageArray = [...imagesData];
                                    newImageArray.push({svg: svgVar, downloadLink: dwnloadLink, locationCoords: location.coords});

                                    setImagesData(newImageArray);
                                    Alert.alert("Photo uploaded", "Your photo and drawing will be part of your room's scavenger hunt.", [{ text: 'OK'}]);
                                    handleModalClose();
                                    setButtonsDisabled(false);
                                    setIsDrawing(false);
                                }} 
                                disabled={buttonsDisabled}
                                style={styles.iconButton}
                            >
                                <Ionicons name="checkmark-circle" size={28} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 12,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        width: '100%',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
    },
    iconButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 48,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    permissionButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
});
