import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBRgeUoz7wmU5Pp3jaXXiuJJOVT_FuAZTE",
    authDomain: "htn-scavenger.firebaseapp.com",
    databaseURL: "https://htn-scavenger-default-rtdb.firebaseio.com",
    projectId: "htn-scavenger",
    storageBucket: "htn-scavenger.firebasestorage.app",
    messagingSenderId: "167503248042",
    appId: "1:167503248042:web:01f7154f41e7fcfc3beed3",
    measurementId: "G-K0N9NLYXXL"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
export const auth = getAuth(firebase);
signInAnonymously(auth).then(
    () => {
        const uid = auth.currentUser?.uid;
        console.log("Device UID:", uid);
    }
);