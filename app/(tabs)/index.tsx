import { createRoom, deleteParticipant, deleteRoom, getUserId, joinRoom, listenToParticipants, RoomTypes } from '@/lib/firestore';
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
    let stopListening;

    const handleParticipantList = (parti: RoomTypes["participants"]) => {
        setParticipants(parti);
        // if (!participants.map(item => item.id).includes(String(getUserId()))) {
        //     Alert.alert("Removed from room", `You were removed from the room [${onlineRoomId}]. If you were not kicked out, there may be a connectivity issue. Please try again later.`, [{ text: 'OK'}])
        // } else (
        //
        // )
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
    
                                            setState("waiting-room-idle");
                                            handleModalClose();
                                        } else if (state === "joining") {
                                            setHostOrNo(false);
                                            setJoined(true);

                                            await joinRoom(onlineRoomId, nameValue);
                                            // FIX
                                        }

                                        // handleParticipantList()
                                        stopListening = listenToParticipants(onlineRoomId, (parti) => {
                                            handleParticipantList(parti);
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
                        <Text>{state === "creating" ? "Creating..." : "Create a room"}</Text>
                    </TouchableOpacity>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        allowFontScaling={false}
                        placeholder="Room Id (e.g. jGInAU)"
                        placeholderTextColor={"lightgray"}
                        value={onlineRoomId}
                        onChangeText={(txt) => {setOnlineRoomId(txt);}}
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
                    </View>
                    {hostOrNo 
                        ? <TouchableOpacity
                            onPress={() => {
                                setJoined(false);
                                setOnlineRoomId("");
                                setHostOrNo(false);
                            }}
                        >
                            <Text>Cancel room</Text>
                        </TouchableOpacity> 
                        : <TouchableOpacity
                            onPress={() => {
                                setJoined(false);
                                setOnlineRoomId("");
                                setHostOrNo(false);

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
