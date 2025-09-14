import { createRoom, deleteParticipant, deleteRoom, getUserId, joinRoom, listenToParticipants, RoomTypes } from '@/lib/firestore';
import { useGlobals } from '@/lib/useGlobals';
import { Unsubscribe } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Modal, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Rooms() {
    const { onlineRoomId, setOnlineRoomId, hostOrNo, setHostOrNo, setJoined } = useGlobals();

    const [state, setState] = useState("idle");
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const [waitingDots, setWaitingDots] = useState("");
    const waitingDotsRef = useRef(waitingDots);
    const maxWaitingDots = 3;
    useEffect(() => {
        if (state === "waiting-room-idle") {
            const interval = setInterval(() => {
                setWaitingDots(prev => {
                    if (prev.length < maxWaitingDots) {
                        return prev + ".";
                    } else {
                        return "";
                    }
                });
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [state]);

    // Name input
    const [modalVisible, setModalVisible] = useState(false);
    const [nameValue, setNameValue] = useState('');

    const [participants, setParticipants] = useState<RoomTypes["participants"]>([]);
<<<<<<< HEAD
    const [roomData, setRoomData] = useState<RoomTypes | null>(null);
    let stopListening: null | Unsubscribe = null;

    const handleParticipantList = (d: RoomTypes) => {
        if (d.participants !== participants) {
            setParticipants(d.participants);
        }

        setRoomData(d);

        if (!d.participants.map(item => item.id).includes(String(getUserId()))) {
            Alert.alert("Removed from room", `You were removed from the room [${onlineRoomId}]. There may be a connectivity issue. Please try again later.`, [{ text: 'OK'}]);
            setJoined(false);
            setOnlineRoomId("");
            setHostOrNo(false);
            setState("idle");
            if (stopListening) {
                stopListening();
            }
        } else {
            if (d.started === true) {
                setState("scavenging");
            }
        }
=======
    let stopListening;

    const handleParticipantList = (parti: RoomTypes["participants"]) => {
        setParticipants(parti);
        // if (!participants.map(item => item.id).includes(String(getUserId()))) {
        //     Alert.alert("Removed from room", `You were removed from the room [${onlineRoomId}]. If you were not kicked out, there may be a connectivity issue. Please try again later.`, [{ text: 'OK'}])
        // } else (
        //
        // )
>>>>>>> c577d8e329f79031f511becfe86e0db7e4299140
    }

    const handleNetworkButtons = (callback: () => void) => {
        setButtonsDisabled(true);
        callback();
    }

    const handleModalClose = () => {
        setModalVisible(!modalVisible);
        setButtonsDisabled(false);
    }

    return ( 
        <SafeAreaView style={{display: "flex", flex: 1, alignItems: "center", justifyContent: "center"}}>
<<<<<<< HEAD
            <View className="absolute flex flex-1 items-center justify-center">
=======
            <View className="flex flex-1 items-center justify-center">
>>>>>>> c577d8e329f79031f511becfe86e0db7e4299140
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        handleModalClose();
                    }}
                >
                    <Pressable className="flex flex-1 justify-center items-center bg-[#00000099] p-[12px]" onPress={() => {handleModalClose()}}>
                        <View className="flex w-60 bg-white rounded-lg pt-[20px] px-[12px] items-center">
                            <View className="flex">
                                <Text className="text-lg text-center">Input your name</Text>
                                <TextInput
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    allowFontScaling={false}
                                    placeholder="Your name here"
                                    placeholderTextColor={"lightgray"}
                                    value={nameValue}
                                    style={{ paddingTop: 8, marginBottom: 12, fontSize: 16, textAlign: "center" }}
                                    onChangeText={(txt) => {setNameValue(txt);}}
                                />
                            </View>
                            <View className="flex flex-row self-stretch items-center justify-center">
                                <Pressable 
                                    style={{
                                        padding: 12,
                                        borderRadius: 12,
                                        flex: 1,
                                        display: 'flex',
                                    }}
                                    onPress={() => {
                                        handleModalClose();
                                    }}
                                >
                                    <Text className="text-lg">Cancel</Text>
                                </Pressable>
                                <Pressable 
                                    style={{
                                        padding: 12,
                                        borderRadius: 12,
                                        flex: 1,
                                        display: 'flex',
                                    }}
                                    onPress={async () => {
                                        let newRoomId = "";
                                        if (state === "creating") {
                                            if (onlineRoomId !== "") {
                                                deleteRoom(onlineRoomId);
                                            }
                                            const { roomId } = await createRoom(nameValue);
                                            newRoomId = roomId;
                                            setOnlineRoomId(roomId);
                                            setHostOrNo(true);
                                            setJoined(true);
    
                                            setState("waiting-room-idle");
                                            handleModalClose();
                                        } else if (state === "joining") {
                                            setHostOrNo(false);
                                            setJoined(true);

                                            await joinRoom(onlineRoomId, nameValue);
                                            // FIX
                                        }
<<<<<<< HEAD
                                        
                                        setState("waiting-room-idle");
                                        stopListening = listenToRoomData(newRoomId, (d) => {
                                            handleParticipantList(d);
=======

                                        // handleParticipantList()
                                        stopListening = listenToParticipants(onlineRoomId, (parti) => {
                                            handleParticipantList(parti);
>>>>>>> c577d8e329f79031f511becfe86e0db7e4299140
                                        });
                                    }}
                                >
                                    <Text className="text-blue-500 text-lg">Confirm</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            </View>
            {state === "idle" || state === "creating"
                && <>
                    <TouchableOpacity
                        onPress={() => {
                            handleNetworkButtons(async () => {
                                setState("creating");
                                setModalVisible(true);
                                setButtonsDisabled(false);
                            });
                        }}
                        disabled={buttonsDisabled}
                    >
                        <View className="flex text-center px-[12px] py-[12px] rounded-lg">
                            <Text className="text-xl font-semibold text-center">{state === "creating" ? "Creating..." : "Create a room"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        allowFontScaling={false}
                        placeholder="Room Id (e.g. jGInAU)"
                        placeholderTextColor={"lightgray"}
                        value={onlineRoomId}
<<<<<<< HEAD
                        style={{padding: 8}}
                        className="text-xl font-semibold"
                        onChangeText={(txt) => {setOnlineRoomId(txt.trim());}}
=======
                        onChangeText={(txt) => {setOnlineRoomId(txt);}}
>>>>>>> c577d8e329f79031f511becfe86e0db7e4299140
                    />
                    <TouchableOpacity
                        onPress={() => {
                            handleNetworkButtons(async () => {
                                setState("joining");

                                setModalVisible(true);
                                setButtonsDisabled(false);
                            })
                        }}
                        disabled={buttonsDisabled}
                    >
                        <View className="text-center px-[12px] py-[12px] rounded-lg">
                            <Text className="text-xl font-semibold">Join a room</Text>
                        </View>
                    </TouchableOpacity>
                </>
            }
            {state === "waiting-room-idle" &&
                <View className="flex flex-1 pt-[32px] w-full items-center">
                    <Text className="text-2xl font-semibold text-center">Room number: {onlineRoomId}</Text>
                    <Text className="text-xl font-semibold text-center">Waiting for participants to join{waitingDots}</Text>

                    <TouchableOpacity>
                        <Text className="text-center">Start!</Text>
                    </TouchableOpacity>
<<<<<<< HEAD
                    <View className="flex flex-1 overflow-y-auto flex-col items-center">
                        <View className="flex flex-row mt-[12px] items-center px-[80px] gap-[60px]">
                            <Text className="text-lg font-semibold">Player List</Text>
                        </View>
                        {participants.map((player, ind) => {
                            return (
                                <View key={ind} className="flex flex-row flex-1 items-center px-[80px] gap-[60px]">
                                        
                                    <Text className="text-lg font-semibold">{player.name}</Text>
                                    <Text className="text-lg">{player.id === roomData?.hostId ? "Host" : "Player"}</Text>
                                    
                                    {hostOrNo &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (player.id !== roomData?.hostId) {
                                                    deleteParticipant(onlineRoomId, player.id);
                                                }
                                            }}
                                        >
                                            <Text className="text-red-500 text-lg">(Kick)</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        })}
=======
                    <View className="flex flex-1 overflow-y-auto flex-col">
                        <View className="flex flex-row flex-1 items-center">
                            <Text>Name</Text>
                            <Text>Role</Text>
                            
                            {hostOrNo &&
                                <TouchableOpacity
                                    onPress={() => {
                                        // deleteParticipant(onlineRoomId, )
                                    }}
                                >
                                    <Text className="text-red-300">Kick</Text>
                                </TouchableOpacity>
                            }
                        </View>
>>>>>>> c577d8e329f79031f511becfe86e0db7e4299140
                    </View>
                    {hostOrNo 
                        ? <TouchableOpacity
                            onPress={() => {
                                setJoined(false);
                                setOnlineRoomId("");
                                setHostOrNo(false);
<<<<<<< HEAD
                                setState("idle");

                                if (stopListening) {
                                    stopListening();
                                }
=======
>>>>>>> c577d8e329f79031f511becfe86e0db7e4299140
                            }}
                        >
                            <Text>Cancel room</Text>
                        </TouchableOpacity> 
                        : <TouchableOpacity
                            onPress={() => {
                                setJoined(false);
                                setOnlineRoomId("");
                                setHostOrNo(false);
<<<<<<< HEAD
                                setState("idle");
                                if (stopListening) {
                                    stopListening();
                                }
=======
>>>>>>> c577d8e329f79031f511becfe86e0db7e4299140

                                deleteParticipant(onlineRoomId, null)
                            }}
                        >
                            <Text>Leave</Text>
                        </TouchableOpacity>
                    }
                </View>
            }
        </SafeAreaView>
    );
}
