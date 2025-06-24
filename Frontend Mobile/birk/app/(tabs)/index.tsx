import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import axios from 'axios';
import { Buffer } from 'buffer';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Appearance,
  FlatList,
  Image,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { SlideInDown, SlideInUp, SlideOutDown, SlideOutUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemedButtonIrish from "../components/ThemedButtonIrish";
import ThemedButtonIrishStart from "../components/ThemedButtonIrishStart";
import { useAuth } from "../context/AuthContext";


export default function Index() {

  interface birthmarkInterface {
    id: number;
    user_id: number;
    date_created: Date;
    diagnosis: string;
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpen2, setIsOpen2] = useState<boolean>(false);
  const [birthmarks, setBirthmarks] = useState<birthmarkInterface[]>([]);
  const [myUris, setMyUris] = useState<string[]>([]);
  const [reload, setReload] = useState<boolean>(true);
  const { onCheck } = useAuth();
  const defaultImage = require('../../assets/images/picture.png');
  const isFocused = useIsFocused();

  const router = useRouter();

  useEffect(() => {
      async function f() {
          if (onCheck) {
              let c = await onCheck();
              if(!c) {
                  router.navigate('/(tabs)/(account)/login')
              }
          }
      }
      f();
  }, [isFocused]);
  
  useEffect(() => {
    axios.get('/api/birthmarks/get', {
        headers: {
          'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
        }
      }).then(r => {
        setBirthmarks(r.data);
        const uris: string[] = [];
        const promises: Promise<string>[] = []

        r.data.forEach((item: birthmarkInterface) => (
          promises.push(axios.get(`/api/birthmarks/get/image/${item.id}`, {
            responseType: 'arraybuffer',
            headers: {
              'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
          }))
        ));
        Promise.all(promises.map(p => p.catch(e => e))).then(myarr => {
          myarr.forEach(result => {
            let base64ImageString = Buffer.from(result.data, 'binary').toString('base64')
            let myuri = "data:svg+xml;base64," + base64ImageString;
            setMyUris(uris => [...uris, myuri]);
          });
        }).catch((e) => {
            //
        })
      }).catch(e => {
        //
      })
  }, [reload, isFocused]);

  const openDrawer = () => {
    setIsOpen(!isOpen);
  }

    const openDrawer2 = () => {
        setIsOpen2(!isOpen2);
    }
  
  const uploadBirthmark = async (image: any) => {
        const formData = new FormData();
        let diagnosis: string;
        formData.append("file", {
            uri: image.uri,
            name: image.fileName || "photo.jpg",
            type: image.type || "image/jpeg"
        } as any);
        axios.post("/api/birthmarks/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
            }
        }).then(async (r) => {
            diagnosis = r.data.diagnosis;
            formData.append("id", r.data.id);
            await axios.post('/api/birthmarks/picture', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken'),
              }
            }).then(r => {
              alert("Birthmark uploaded successfully \n Diagnosis: " + diagnosis);
              setReload(!reload)
              setIsOpen(false);
            }).catch(e => {
              alert(e.response.data.detail)
            })
        }).catch((e) => {
            alert(e.response.data.detail);
        })
    }

  const openCamera = async () => {
    try {
        await ImagePicker.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });
        if(!result.canceled) {
            await uploadBirthmark(result.assets[0])
        } else {

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
            await uploadBirthmark(result.assets[0])
        }
    } catch (e) {
        alert(`Failed to launch gallery - ${e.message}`);
    }
}

const createTwoButtonAlert = (id: number) =>
    Alert.alert('Delete Birthmark', 'Do you want to delete birthmark id: ' + id + '?', [
        {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteBirthmark(id)},
    ]);

const deleteBirthmark = (id: number) => {
  axios.delete(`/api/birthmarks/delete/${id}`, {
    headers: {
      'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken')
    }
  }).then(() => {
    setReload(!reload);
    alert('Birthmark with id ' + id + ' deleted.')
  }).catch(e => {
    alert(e.response.data.detail)
  })
}

  const renderItem = ({ item, index }: any) => {

    return (
      <View key={index} className="w-['46%'] h-fit rounded-xl m-2 flex-col justify-start items-center bg-modal-light dark:bg-modal-dark border border-modal-light dark:border-modal-dark">
              <View className="w-full h-40 aspect-16/9 border-3xl">
                <TouchableOpacity className="w-10 h-10 absolute top-1 right-1 z-10 border border-errorBtn-main dark:border-errorBtn-light items-center justify-center rounded-xl" onPress={() => createTwoButtonAlert(item.id)}>
                  <Text className="text-errorBtn-main dark:text-errorBtn-light"><Ionicons name="trash-outline" size={22}/></Text>
                </TouchableOpacity>
                <Image source={myUris[index] ? {uri: myUris[index]} : defaultImage} style={{objectFit: 'cover', 
                                                  width: '100%', 
                                                  height: '100%', 
                                                  borderRadius: 10,}}/>
              </View>
        <View className="flex-col w-full h-fit p-2 justify-start items-start">
            <Text className="text-sm font-normal text-text-light dark:text-text-dark">Id: {item.id}</Text>
            <Text className="text-sm font-normal text-text-light dark:text-text-dark">Created: {item.date_created}</Text>
            <Text className="text-sm font-normal text-text-light dark:text-text-dark">Diagnosis: {item.diagnosis}</Text>
        </View>
      </View>
    )
  }
  
  return (
    <SafeAreaView style={{flex: 1, margin: 0, backgroundColor: Appearance.getColorScheme() === 'dark' ?  'rgb(20, 20, 20)' : 'rgb(255, 255, 255)', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
        <View className="w-['100%'] h-['95%'] ">
            <View className="w-['100%'] h-['100%'] min-h-['95%'] flex-col justify-start items-center">
                <TouchableOpacity onPress={openDrawer2} className="w-['86%'] flex-row mt-4 p-1 rounded-3xl justify-end items-center">
                    <Text className="text-lg font-normal text-text-light dark:text-text-dark"><Ionicons name="filter-outline" size={22} color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}/></Text>
                </TouchableOpacity>
                <View className="w-['100%'] h-['88%'] min-h-['88%'] mb-2 flex-col justify-start items-center">
                    <FlatList
                        data={birthmarks}
                        renderItem={renderItem}
                        numColumns={2}
                        className="w-['90%'] min-h-['80%'] flex-1 -z-10 flex-column flex-nowrap rounded-3xl mt-2 mb-8 ml-8 mr-8"
                    />
                </View>
              <View className="w-['90%'] sticky flex-col bottom-6 justify-center items-center rounded-3xl ">
                <ThemedButtonIrish title={"Check birthmark"} icon={<Ionicons name="cloud-outline" size={22} color={'white'} />} onPress={openDrawer} />
              </View>
            </View>
        {isOpen && (
            <>
              <Pressable onPress={openDrawer} className="h-fit w-['100%'] z-10 absolute bottom-0">
                <Animated.View
                    className="w-['100%'] bottom-0 fixed gap-3.5 h-fit pl-8 pr-8 pb-8 rounded-t-3xl bg-modal-light dark:bg-modal-dark justify-center items-center"
                    entering={SlideInDown.springify().damping(15)}
                    exiting={SlideOutDown.springify().damping(15)}
                >
                    <Ionicons
                        style={{

                        }}
                        name={"chevron-down-outline"}
                        size={28}
                        color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}/>
                    <ThemedButtonIrishStart title={"Camera"} icon={<Ionicons name={"camera-outline"} size={22} />} onPress={openCamera} />
                    <ThemedButtonIrishStart title={"Picutres"} icon={<Ionicons name={"image-outline"} size={22} />} onPress={uploadImage} />
                </Animated.View>
              </Pressable>
            </>
        )}
            {isOpen2 && (
                <>
                    <Pressable onPress={openDrawer2} className="h-fit w-['100%'] z-10 absolute top-0">
                        <Animated.View
                            className="w-['100%'] bottom-0 fixed gap-3.5 h-fit pl-8 pr-8 pb-2 pt-4 rounded-t-3xl bg-modal-light dark:bg-modal-dark justify-center items-center"
                            entering={SlideInUp.springify().damping(15)}
                            exiting={SlideOutUp.springify().damping(15)}
                        >
                            <TouchableOpacity className="w-full" onPress={() => {openDrawer2(); router.navigate('/(tabs)/(search)/Benign');}}>
                                <Text className="text-2xl text-text-light dark:text-text-dark">Benign</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="w-full" onPress={() => {openDrawer2(); router.navigate('/(tabs)/(search)/Malignant');}}>
                                <Text className="text-2xl text-text-light dark:text-text-dark">Malignant</Text>
                            </TouchableOpacity>
                            <Ionicons
                                style={{

                                }}
                                name={"chevron-up-outline"}
                                size={28}
                                color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}/>
                        </Animated.View>
                    </Pressable>
                </>
            )}
      </View>
    </SafeAreaView>
  );
}