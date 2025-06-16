import ThemedButtonIrish from "@/app/components/ThemedButtonIrish";
import { useAuth } from "@/app/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Fragment, useState } from "react";
import { Appearance, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";


export default function Account() {
    const { authState, onLogout, onCheck } = useAuth();
    const router = useRouter();
    const [display, setDisplay] = useState(false);

    useFocusEffect(() => {
        async function f() {
            if (onCheck) {
                let c = await onCheck();
                if(!c) {
                    setDisplay(false);
                    router.navigate('/(tabs)/(account)/login')
                } else {
                    setDisplay(true);
                }
            }
        }
        f();
        return () => {

        }
    });

    const logout = async () => {
        if (onLogout) {
            await onLogout();
            router.navigate('/(tabs)/(account)/login');
        }
    }

    return (
        <Fragment>
            {display && (
                <>
                    <SafeAreaView style={{flex: 1, margin: 0, backgroundColor: Appearance.getColorScheme() === 'dark' ?  'rgb(20, 20, 20)' : 'rgb(255, 255, 255)', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                        <View className="w-['100%'] h-['95%']">
                            <View className="flex-1 w-['100%'] h-['50%'] items-center justify-start bg-background-light dark:bg-background-dark " >
                                <View className="w-['100%'] max-h-['50%'] h-fit items-center justify-start rounded-2xl p-8">
                                    <View className="w-['100%'] flex-row h-fit justify-center items-center mb-4 pb-4 border-b border-text-light dark:border-shadowLink-dark">
                                        <Text className="text-2xl inline-block align-middle leading-8 text-text-light items-center justify-start dark:text-text-dark font-medium">Welcome, {SecureStore.getItem("userName")}.</Text>
                                    </View>
                                    <TouchableOpacity className="w-['100%'] flex-row h-fit pl-8 pr-8 pb-2 pt-2 mt-4 mb-4 rounded-lg border border-text-light dark:border-shadowLink-dark">
                                        <Text className="text-xl align-middle text-text-light dark:text-text-dark"><Ionicons name="image-outline" size={22}/></Text>
                                        <Text className="text-xl inline-block align-middle leading-8 text-text-light dark:text-text-dark font-medium">  Results</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="w-['100%'] flex-row h-fit pl-8 pr-8 pb-2 pt-2 mt-4 mb-4 rounded-lg border border-text-light dark:border-shadowLink-dark">
                                        <Text className="text-xl align-middle text-text-light dark:text-text-dark"><Ionicons name="heart-outline" size={22}/></Text>
                                        <Text className="text-xl leading-8 text-text-light dark:text-text-dark font-medium">  Checkups</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.navigate('/(tabs)/(account)/settings')} className="w-['100%'] flex-row h-fit pl-8 pr-8 pb-2 pt-2 mt-4 rounded-lg border border-text-light dark:border-shadowLink-dark">
                                        <Text className="text-xl align-middle text-text-light dark:text-text-dark"><Ionicons name="settings-outline" size={22}/></Text>
                                        <Text className="text-xl leading-8 text-text-light dark:text-text-dark font-medium">  Settings</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="w-['100%'] h-['50%'] items-center justify-end p-4">
                                    <ThemedButtonIrish title="Logout" icon={<Ionicons name="log-out-outline" size={22}/>} onPress={logout} />
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </>
            )}
        </Fragment>
    )
}