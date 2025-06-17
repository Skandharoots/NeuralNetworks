import ThemedButtonIrishStart from "@/app/components/ThemedButtonIrishStart";
import ThemedButtonRedOutline from "@/app/components/ThemedButtonRedOutline";
import UpdateAccountModal from "@/app/components/UpdateAccountModal";
import { useAuth } from "@/app/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Appearance,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

export default function Account() {

    const [pic, setPic] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    // @ts-ignore
    const { authState, onLogout, onCheck } = useAuth();
    const router = useRouter();
    const [display, setDisplay] = useState<boolean>(false);

    const defaultImage = require('../../../assets/images/user.png');


    useFocusEffect(() => {
        async function f() {
            if (onCheck) {
                let c = await onCheck();
                if(!c) {
                    setDisplay(false);
                    router.navigate('/(tabs)/(account)/login')
                }  else {
                    loadUser();
                    setDisplay(true);
                }
            }
        }
        f();
        return () => {
            
        }
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = () => {
        axios.get("/api/users/me", {
            headers: {
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(r => {
            setFirstName(r.data.first_name);
            setLastName(r.data.last_name);
            setUsername(r.data.username);
            setEmail(r.data.email);
        }).catch((e) => {
        })

        axios.get('/api/users/picture', {
            headers: {
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(r => {
                setPic(r.data)
            }).catch((e) => {
                alert(e)
            })
    }

    const logout = async () => {
        if (onLogout) {
            await onLogout();
            router.navigate('/(tabs)/(account)/login');
        }
    }

    const openDrawer = () => {
        setIsOpen(!isOpen);
    }

    const saveImage = (image: any) => {
        
        axios.post("/api/users/picture", {}, {
            params: {
                fileName: image.uri,
            },
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(() => {
            alert("Photo uploaded successfully");
            setPic(image.uri);
        }).catch((e) => {
            alert(e.response.data);
        })
    }

    const deleteImage = () => {
        axios.delete('/api/users/picture', {
            headers: {
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        })
        .then((r) => {
            alert('Picture removed');
            setPic('');
        }).catch(e => {
            alert(e.response.data);
        })
    }

    const openCamera = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.front,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            });
            if(!result.canceled) {
                saveImage(result.assets[0])
            }
        } catch (e) {
            alert(`Failed to launch camera - ${e.message}`);
        }
    }

    const uploadImage = async () => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync()
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                aspect: [1, 1],
                allowsEditing: true,
                quality: 1,
                base64: true,
            })
            if (!result.canceled) {
                saveImage(result.assets[0])
            }
        } catch (e) {
            alert(`Failed to launch gallery - ${e.message}`);
        }
    }

    const createTwoButtonAlert = () =>
    Alert.alert('Delete Account', 'Do you want to delete account?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteAccount()},
    ]);

    const deleteAccount = () => {
        axios.delete('/api/users/me', {
            headers: {
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(async () => {
            if (onLogout) {
                await onLogout()
            }
            router.navigate('/(tabs)')
        }).catch(e => {
            alert(e);
        })
    }

    // @ts-ignore
    return (
        <SafeAreaView style={{flex: 1, margin: 0, backgroundColor: Appearance.getColorScheme() === 'dark' ?  'rgb(20, 20, 20)' : 'rgb(255, 255, 255)', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
            {display && (
                <>
                    <GestureHandlerRootView>
                        <View className="h-['95%'] w-'100%']">
                            <ScrollView>
                                <View className="w-['100%'] h-['95%'">
                                    <View className="flex-1 w-['100%'] h-['100%'] mb-8 items-center justify-start bg-background-light dark:bg-background-dark " >
                                        <View className="border-4 rounded-['50%'] bg-white border-shadowLink-light dark:border-shadowLink-dark w-52 h-52">
                                            <Image style={{
                                                objectFit: 'cover', 
                                                width: '100%', 
                                                height: '100%', 
                                                borderRadius: '50%'
                                                }}
                                                    resizeMode={"contain"} 
                                                    source={pic ? {uri: pic} : defaultImage}
                                                />
                                            <View className="dark:bg-camera-dark bg-camera-light rounded-['50%'] w-10 h-10 mt-36 absolute self-end justify-center items-center">
                                                <Ionicons onPress={openDrawer} name="camera-outline" size={24}
                                                          style={{color: Appearance.getColorScheme() === 'dark'
                                                                  ? 'rgb(0, 0, 0)'
                                                                  : 'rgb(100, 100, 100)',
                                                              zIndex: 20
                                                          }}
                                                />
                                            </View>
                                        </View>
                                        <View className="p-4 mt-8 flex-col w-['80%'] justify-center items-center border-shadowLink-light dark:border-shadowLink-dark border rounded-2xl">
                                            <Text className="text-2xl font-semibold text-text-light border-b-2 border-text-light dark:border-text-dark dark:text-text-dark mb-2">{username}</Text>
                                            <Text className="text-lg font-semibold text-text-light dark:text-text-dark ">{firstName} {lastName}</Text>
                                        </View>
                                        <View className="p-4 mt-8 flex-row w-['80%'] justify-start items-center border-shadowLink-light dark:border-shadowLink-dark border rounded-2xl">
                                            <Text className="text-lg font-semibold text-text-light dark:text-text-dark"><Ionicons name="mail-outline" size={22} color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'} /></Text>
                                            <Text className="text-lg font-semibold text-text-light dark:text-text-dark ">    {email}</Text>
                                        </View>
                                        <TouchableOpacity className="p-4 mt-8 flex-row w-['80%'] justify-start items-center border-shadowLink-light dark:border-shadowLink-dark border rounded-2xl" onPress={() => setIsUpdateOpen(true)}>
                                            <Text className="text-lg font-semibold text-text-light dark:text-text-dark"><Ionicons name="create-outline" size={22} color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'} /></Text>
                                            <Text className="text-lg font-semibold text-text-light dark:text-text-dark ">    Update account</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="p-4 mt-8 flex-row w-['80%'] justify-start items-center border-irish-light dark:border-irish-dark border rounded-2xl" onPress={logout}>
                                            <Text className="text-lg font-semibold text-text-light dark:text-text-dark"><Ionicons name="log-out-outline" size={22} color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'} /></Text>
                                            <Text className="text-lg font-semibold text-text-light dark:text-text-dark ">    Logout</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="p-4 mt-20 flex-row w-['80%'] justify-start items-center border-errorBtn-dark dark:border-errorBtn-light border rounded-2xl" onPress={createTwoButtonAlert}>
                                            <Text className="text-lg font-semibold text-errorBtn-main dark:text-errorBtn-light"><Ionicons name="trash-outline" size={22} color={Appearance.getColorScheme() === 'dark' ? 'rgb(193,56,56)' : 'rgb(159,20,20)'} /></Text>
                                            <Text className="text-lg font-semibold text-errorBtn-main dark:text-errorBtn-light ">    Delete account</Text>
                                        </TouchableOpacity>
                                        
                                    </View>
                                </View>
                            </ScrollView>
                            {isOpen && (
                                <>
                                    <Pressable onPress={openDrawer} className="h-fit w-['100%'] absolute bottom-0">
                                        <Animated.View
                                            className="w-['100%'] bottom-0 fixed gap-3.5 h-fit pl-8 pr-8 pb-8 rounded-t-3xl bg-shadowLink-dark dark:bg-shadowLink-light justify-center items-center"
                                            entering={SlideInDown.springify().damping(15)}
                                            exiting={SlideOutDown.springify().damping(15)}
                                        >
                                            <Ionicons
                                                style={{

                                                }}
                                                name={"chevron-down-outline"}
                                                size={28}
                                                color={Appearance.getColorScheme() === 'dark' ? 'black' : 'white'}/>
                                            <ThemedButtonIrishStart title={"Camera"} icon={<Ionicons name={"camera-outline"} size={22} />} onPress={openCamera} />
                                            <ThemedButtonIrishStart title={"Picutres"} icon={<Ionicons name={"image-outline"} size={22} />} onPress={uploadImage} />
                                            <ThemedButtonRedOutline title={"Delete"} icon={<Ionicons name={"trash-bin-outline"} size={22} color={Appearance.getColorScheme() === 'dark' ? 'rgb(193,56,56)' : 'rgb(159,20,20)'}/>} onPress={deleteImage}/>
                                        </Animated.View>
                                    </Pressable>
                                </>
                            )}
                            {isUpdateOpen && (
                                <UpdateAccountModal setIsUpdateOpen={setIsUpdateOpen} />
                            )}
                        </View>
                    </GestureHandlerRootView>
                </>
            )}
        </SafeAreaView>
    )
}