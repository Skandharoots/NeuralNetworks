import ThemedButtonIrishStart from "@/app/components/ThemedButtonIrishStart";
import { useAuth } from "@/app/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    Appearance,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";


export default function Account() {

    const [pic, setPic] = useState('a');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    // @ts-ignore
    const { authState, onLogout, onCheck } = useAuth();
    const router = useRouter();
    const [display, setDisplay] = useState<boolean>(false);

    useFocusEffect(() => {
        async function f() {
            if (onCheck) {
                let c = await onCheck();
                if(!c) {
                    setDisplay(false);
                    router.navigate('/(tabs)/(account)/login')
                }  else {
                    setDisplay(true);
                }
            }
        }
        f();
        return () => {

        }
    });

    useEffect(() => {
        axios.get("/api/users/me", {
            headers: {
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(r => {
            setFirstName(r.data.first_name);
            setLastName(r.data.last_name);
            setUsername(r.data.username);
        }).catch((e) => {
        })

        axios.get('/api/users/picture', {
            responseType: 'blob',
            headers: {
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(r => {
                setPic('data:image/jpeg;base64,' + r.data)
            }).catch((e) => console.log(e))
    }, []);


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
        const form = new FormData();
        form.append("file", image);
        axios.post("/api/users/picture", form, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(() => {
            alert("Photo uploaded successfully");
            setPic(image);
        }).catch((e) => {
            console.log(e.response.data);
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

    // @ts-ignore
    return (
        <SafeAreaView style={{flex: 1, margin: 0, backgroundColor: Appearance.getColorScheme() === 'dark' ?  'rgb(20, 20, 20)' : 'rgb(255, 255, 255)', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
            {display && (
                <>
                    <GestureHandlerRootView>
                        <View className="h-['95%'] w-'100%'] border-2 border-background-light">
                            <ScrollView>
                                <View className="w-['100%'] h-['95%'] border-2 border-background-light">
                                    <View className="flex-row w-['100%'] pl-4 pr-4 items-center justify-between bg-background-light dark:bg-background-dark " >
                                        <Text onPress={() => router.navigate('/(tabs)/(account)/account')} className="w-['33%']"><Ionicons name="arrow-back-outline" size={28} color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}/></Text>
                                    </View>
                                    <View className="flex-1 w-['100%'] h-['100%'] items-center justify-start bg-background-light dark:bg-background-dark " >
                                        <View className="border-4 rounded-['50%'] border-shadowLink-light dark:border-shadowLink-dark w-52 h-52">
                                            <Image style={{objectFit: 'cover', width: '100%', height: '100%', borderRadius: '50%'}} resizeMode={"contain"} source={{uri: pic}}></Image>
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
                                    </View>
                                </View>
                            </ScrollView>
                            {isOpen && (
                                <>
                                    <Pressable onPress={openDrawer} className="h-fit w-['100%'] absolute bottom-0">
                                        <Animated.View
                                            className="w-['100%'] bottom-0 fixed gap-3.5 h-fit pl-8 pr-8 pb-8 rounded-t-3xl bg-camera-light dark:bg-camera-dark justify-center items-center"
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
                                        </Animated.View>
                                    </Pressable>
                                </>
                            )}
                        </View>
                    </GestureHandlerRootView>
                </>
            )}
        </SafeAreaView>
    )
}