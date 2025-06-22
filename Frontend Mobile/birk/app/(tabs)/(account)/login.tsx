import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import React, { Fragment, useEffect, useState } from "react";
import { Appearance, Platform, SafeAreaView, StatusBar, Text, View } from "react-native";
import ThemedButton from '../../components/ThemedButtonIrish';
import ThemedButtonWhiteOutline from "../../components/ThemedButtonWhiteOutline";
import ThemedTextInput from '../../components/ThemedTextInput';
import { useAuth } from "../../context/AuthContext";


export default function Login() {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const router = useRouter();
    const { onLogin, onCheck } = useAuth();
    const [mydisplay, setDisplay] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        async function f() {
            if (onCheck) {
                let c = await onCheck();
                if(c) {
                    router.navigate('/(tabs)/(account)/account')
                }
            }
        }
        f();
    }, [isFocused]);
    
    const validate = () => {
        let isValid = true;

        if (!userName
            || !/^(?=.{1,150}$)[A-Za-z0-9@/./+/-/_]+$/i.test(userName)) {
            setUserNameError(true);
            setUserNameErrorMessage('Username can contain letters,' +
                ' numbers and special characters @/./+/-/_');
            isValid = false;
        } else {
            setUserNameError(false);
            setUserNameErrorMessage('');
        }

        if (!password || password.length < 6 || password.length > 50) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 and at max 50 characters long.');
            isValid = false;
        } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\[{}\]:;',?/*~$^+=<>]).{6,50}$/.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must contain one lower and upper case letter, one number and one special character.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    }

    const login = async () => {
 
        if (!validate())
            return;
        const result = await onLogin!(userName, password);
        if (result && result.error) {
            alert(result.msg.message);
        } else {
            router.navigate('/(tabs)/(account)/account');
        }
    }

    // @ts-ignore
    return (
        <Fragment>
            {mydisplay && (
                <>
                    <SafeAreaView style={{flex: 1, margin: 0, backgroundColor: Appearance.getColorScheme() === 'dark' ?  'rgb(20, 20, 20)' : 'rgb(255, 255, 255)', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                        <View className="flex-1 w-['100%'] h-['100%'] items-center justify-start bg-background-light dark:bg-background-dark " >
                            <View className="w-['95%'] h-['50%'] items-center justify-center rounded-2xl p-8">
                                <Text className="text-4xl font-semibold text-text-light dark:text-text-dark mb-10 ">Login</Text>
                                <ThemedTextInput autoCapitalize="none" placeholder={"Email"} value={userName} onChangeText={setUserName} keyboard={"email-address"}/>
                                {userNameError &&
                                    <Text className="text-sm w-['95%'] text-errorBtn-light">{userNameErrorMessage}</Text>
                                }
                                <ThemedTextInput placeholder={"Password"} value={password} onChangeText={setPassword} secureTextEntry={true}/>
                                {passwordError &&
                                    <Text className="text-sm w-['95%'] mb-4 text-errorBtn-light">{passwordErrorMessage}</Text>
                                }
                                <ThemedButton title={"Login"} icon={<Ionicons name="log-in-outline" size={22} />} onPress={login}/>
                            </View>
                            <View className="w-['95%'] h-['40%'] items-center justify-end rounded-2xl p-8">
                                <ThemedButtonWhiteOutline title={"Register"} icon={<Ionicons name="person-add-outline" size={22} />} onPress={() => router.navigate('/(tabs)/(account)/register')}/>
                                <Text className="text-text-light dark:text-text-dark text-center mt-4">Don&apos;t have an account? Register now!</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </>
            )}
        </Fragment>
    );

}