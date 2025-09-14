import { createRoom, deleteParticipant, deleteRoom, getUserId, joinRoom, listenToRoomData, RoomTypes } from '@/lib/firestore';
import { useGlobals } from '@/lib/useGlobals';
import { Unsubscribe } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Modal, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Rooms() {
    const { onlineRoomId, setOnlineRoomId, hostOrNo, setHostOrNo, setJoined } = useGlobals();

    const [state, setState] = useState("idle");
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const [waitingDots, setWaitingDots] = useState("");
    const maxWaitingDots = 3;
    useEffect(() => {
        if (state === "waiting-room-idle") {
            const interval = setInterval(() => {
                if (waitingDots.length < maxWaitingDots) {
                    setWaitingDots(prev => prev + ".");
                } else {
                    setWaitingDots("");
                }
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [state]);

    // Name input
    const [modalVisible, setModalVisible] = useState(false);
    const [nameValue, setNameValue] = useState('');

    const [participants, setParticipants] = useState<RoomTypes["participants"]>([]);
    const [roomData, setRoomData] = useState<RoomTypes | null>(null);
    let stopListening;

    const handleParticipantList = (d: RoomTypes) => {
        if (d.participants !== participants) {
            setParticipants(d.participants);
        }

        setRoomData(d);

        if (!participants.map(item => item.id).includes(String(getUserId()))) {
            Alert.alert("Removed from room", `You were removed from the room [${onlineRoomId}]. If you were not kicked out, there may be a connectivity issue. Please try again later.`, [{ text: 'OK'}]);
            setJoined(false);
            setOnlineRoomId("");
            setHostOrNo(false);
            setState("idle");
        } else {
            if (d.started === true) {
                setState("scavenging");
            }
        }
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
            <View className="flex flex-1 items-center justify-center">
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        handleModalClose();
                    }}
                >
                    <Pressable className="flex flex-1 justify-center items-center bg-[#00000099] p-[12px]" onPress={() => {handleModalClose()}}>
                        <View className="flex bg-white rounded-lg pt-[12px] px-[12px]">
                            <View className="flex">
                                <Text className="text-lg">Input your name</Text>
                                <TextInput
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    allowFontScaling={false}
                                    placeholder="Input your name"
                                    placeholderTextColor={"lightgray"}
                                    value={nameValue}
                                    onChangeText={(txt) => {setNameValue(txt);}}
                                />
                            </View>
                            <View className="flex flex-row self-stretch items-center justify-center">
                                <Pressable 
                                    style={{
                                        padding: 12,
                                        borderRadius: 12,
                                        flex: 1
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
                                        flex: 1
                                    }}
                                    onPress={async () => {
                                        if (state === "creating") {
                                            if (onlineRoomId !== "") {
                                                deleteRoom(onlineRoomId);
                                            }
                                            const { roomId: newRoomId } = await createRoom(nameValue);
                                            setOnlineRoomId(newRoomId);
                                            setHostOrNo(true);
                                            setJoined(true);
                                        } else if (state === "joining") {
                                            setHostOrNo(false);
                                            setJoined(true);

                                            await joinRoom(onlineRoomId, nameValue);
                                            // FIX

                                        }
                                        
                                        setState("waiting-room-idle")
                                        stopListening = listenToRoomData(onlineRoomId, (d) => {
                                            handleParticipantList(d);
                                        });
                                        handleModalClose();
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
                        <Text>{state === "creating" ? "Creating..." : "Create a room"}</Text>
                    </TouchableOpacity>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        allowFontScaling={false}
                        placeholder="Room Id (e.g. jGInAU)"
                        placeholderTextColor={"lightgray"}
                        value={onlineRoomId}
                        onChangeText={(txt) => {setOnlineRoomId(txt.trim());}}
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
                        <Text>Join a room</Text>
                    </TouchableOpacity>
                </>
            }
            {state === "waiting-room-idle" &&
                <View className="flex flex-1">
                    <Text>Waiting for participants to join{waitingDots}</Text>
                    <Text>{onlineRoomId}</Text>

                    <TouchableOpacity>
                        <Text>Start!</Text>
                    </TouchableOpacity>
                    <View className="flex flex-1 overflow-y-auto flex-col">
                        {participants.map((player, ind) => {
                            return (
                                <View key={ind} className="flex flex-row flex-1 items-center">
                                        
                                    <Text>{player.name}</Text>
                                    <Text>{player.id === roomData?.hostId ? "Host" : "Player"}</Text>
                                    
                                    {hostOrNo &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (player.id !== roomData?.hostId) {
                                                    deleteParticipant(onlineRoomId, player.id);
                                                }
                                            }}
                                        >
                                            <Text className="text-red-300">Kick</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        })}
                    </View>
                    {hostOrNo 
                        ? <TouchableOpacity
                            onPress={() => {
                                setJoined(false);
                                setOnlineRoomId("");
                                setHostOrNo(false);
                                setState("idle");
                            }}
                        >
                            <Text>Cancel room</Text>
                        </TouchableOpacity> 
                        : <TouchableOpacity
                            onPress={() => {
                                setJoined(false);
                                setOnlineRoomId("");
                                setHostOrNo(false);
                                setState("idle");

                                deleteParticipant(onlineRoomId, null)
                            }}
                        >
                            <Text>Leave</Text>
                        </TouchableOpacity>
                    }
                </View>
            }
            {state === "scavenging" &&
                <View>
                    {hostOrNo 
                        ? <TouchableOpacity>
                            <Text>See the map!</Text>
                        </TouchableOpacity>
                        : <Text>
                            Start scavenging!
                        </Text>
                    }
                </View>
            }
        </SafeAreaView>
    );
}
