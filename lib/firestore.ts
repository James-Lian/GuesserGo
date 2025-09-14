import { doc, getDoc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";

import { db, auth } from "./firebaseConfig";

function generateRoomId(length = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function joinRoom() {
    
}

export async function createRoom() {
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

    await setDoc(roomRef, {
        hostId,
        roomId,
        createdAt: Timestamp.now(),
        expireAt: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 60 * 1000)),
        // autodelete data 5 hous from initialization time
        participants: [hostId],
    });

    return {
        hostId,
        roomId,
        createdAt: Timestamp.now(),
        participants: [hostId],
    };
}

export async function deleteRoom(roomId: string) {
    const roomRef = doc(db, "rooms", roomId);
    await deleteDoc(roomRef);
}