import { doc, getDoc, setDoc, deleteDoc, Timestamp, updateDoc, arrayRemove, arrayUnion, onSnapshot } from "firebase/firestore";

import { db, auth } from "./firebaseConfig";

import * as Location from 'expo-location';

function generateRoomId(length = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function getUserId() {
    return auth.currentUser?.uid;
}

export async function joinRoom(roomId: string, playerName: string) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
        participants: arrayUnion([{"id": auth.currentUser?.uid, "name": playerName, "location": null}])
    });
}

export interface RoomTypes {
    hostId: string,
    roomId: string,
    createdAt: Timestamp,
    expireAt: Timestamp,
    participants: { "id": string, "name": string, "location": Location.LocationObjectCoords | null }[],
    started: boolean
}

export async function createRoom(hostName: string) {
    let roomId = generateRoomId();
    let roomRef = doc(db, "rooms", roomId);
    let roomExists = await getDoc(roomRef);

    // Retry until unique ID is found
    while (roomExists.exists()) {
        roomId = generateRoomId();
        roomRef = doc(db, "rooms", roomId);
        roomExists = await getDoc(roomRef);
    }
    
    const hostId = auth.currentUser?.uid;
    
    
    const roomData = {
        hostId,
        roomId,
        createdAt: Timestamp.now(),
        expireAt: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 60 * 1000)),
        // autodelete data 5 hours from initialization time
        participants: [{"id": hostId, "name" : hostName, "location": null}],
        started: false,
    }
    
    await setDoc(roomRef, roomData);

    return roomData;
}

export async function deleteParticipant(roomId: string, participantName: string | undefined | null) {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) return;

    const data = roomSnap.data();
    let updatedParticipants;
    if (participantName) {
        updatedParticipants = data.participants.filter(
            (p: { id: string, name: string }) => p.name !== participantName
        );
    } else if (participantName === null) {
        updatedParticipants = data.participants.filter(
            (p: {id: string, name: string}) => p.id !== auth.currentUser?.uid
        )
    }

    await updateDoc(roomRef, {
        participants: updatedParticipants
    });
}

export async function getAllParticipants(roomId: string) {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) return;

    const data = roomSnap.data();
    return data.participants;
}

export function listenToRoomData(roomId: string, callback: (d: RoomTypes) => void) {
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data() as RoomTypes;
            callback(data);
        }
    });

    return unsubscribe; // Call this to stop listening when needed
}

export async function deleteRoom(roomId: string) {
    const roomRef = doc(db, "rooms", roomId);
    await deleteDoc(roomRef);
}