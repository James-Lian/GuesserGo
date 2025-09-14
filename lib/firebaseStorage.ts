import { UriState } from "react-native-svg";
import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library';

export async function uploadUri(uriPath: string) {
    
}

export async function pickAndUploadImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', 
        allowsMultipleSelection: true,
        allowsEditing: true,
        quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
        const selectedImagesUris = result.assets.map(asset => asset.uri);
        const timestamp = Date.now();

        let downloadLinks = [];

        for (let i=0; i < selectedImagesUris.length; i++) {
            const imageUri = selectedImagesUris[i];
            const response = await fetch(imageUri);
            const blob = await response.blob();
            
            const filename = `${timestamp}(${i + 1})`;
            const storageRef = ref(storage, filename);
            
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            downloadLinks.push(downloadURL);
        }

        return downloadLinks; 
    }
}