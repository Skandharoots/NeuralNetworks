import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { Fragment, useState } from "react";
import { Appearance, Platform, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import ThemedButton from "../../components/ThemedButtonIrish";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useAuth } from "../../context/AuthContext";


export default function Register() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastNameError, setLastNameError] = useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorMessage, setUserNameErrorMessage] = useState('');

    const router = useRouter();
    const { onRegister } = useAuth();

    const validate = () => {

        let isValid = true;

        if (firstName.length > 50 && firstName.length < 1) {
            setFirstNameError(true);
            setFirstNameErrorMessage('First name must be from 1 to 50 characters long.');
        } else if (!firstName
            || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/i.test(firstName)) {
            setFirstNameError(true);
            setFirstNameErrorMessage('First name can contain and must start with a capital letter,' +
                ' it can contain lowercase letters, spaces and special characters -\'_.');
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (lastName.length > 50 && lastName.length < 1) {
            setFirstNameError(true);
            setFirstNameErrorMessage('Last name must be from 1 to 50 characters long.');
        } else if (!lastName
            || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/i.test(lastName)) {
            setLastNameError(true);
            setLastNameErrorMessage('Last name can contain and must start with a capital letter,' +
                ' can contain lowercase letters, spaces and special characters -\'_.');
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

        if (userName.length > 50 && userName.length < 1) {
            setFirstNameError(true);
            setFirstNameErrorMessage('Username must be from 1 to 50 characters long.');
        } else if (!userName
            || !/^(?=.{1,150}$)[A-Za-z0-9@/./+/-/_]+$/i.test(userName)) {
            setUserNameError(true);
            setUserNameErrorMessage('Username can contain letters,' +
                ' numbers and special characters @/./+/-/_');
            isValid = false;
        } else {
            setUserNameError(false);
            setUserNameErrorMessage('');
        }

        if (!email || !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
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

        if (!confirmPassword || password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Password confirmation does not match.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        return isValid;

    }

    const register = async () => {
        if (!validate())
            return;
        const result = await onRegister!(firstName, lastName, userName, email, password);
        if (result && result.error) {
            if (result.msg.response.data.first_name) {
                setFirstNameError(true);
                setFirstNameErrorMessage(result.msg.response.data.first_name);
            } else {
                setFirstNameError(false);
                setFirstNameErrorMessage('');
            }
            if (result.msg.response.data.last_name) {
                setLastNameError(true);
                setLastNameErrorMessage(result.msg.response.data.last_name);
            } else {
                setLastNameError(false);
                setLastNameErrorMessage('');
            }
            if (result.msg.response.data.username) {
                setUserNameError(true);
                setUserNameErrorMessage(result.msg.response.data.username);
            } else {
                setUserNameError(false);
                setUserNameErrorMessage('');
            }
            if (result.msg.response.data.email) {
                setEmailError(true);
                setEmailErrorMessage(result.msg.response.data.email);
            } else {
                setEmailError(false);
                setEmailErrorMessage('');
            }
            if (result.msg.response.data.password) {
                setPasswordError(true);
                setPasswordErrorMessage(result.msg.response.data.password);
            } else {
                setPasswordError(false);
                setPasswordErrorMessage('');
            }

        } else {
            alert('Welcome! ' + userName)
            router.navigate('/(tabs)/(account)/login');
        }

    }

    return (
        <Fragment>
            <SafeAreaView style={{flex: 1, margin: 0, backgroundColor: Appearance.getColorScheme() === 'dark' ?  'rgb(20, 20, 20)' : 'rgb(255, 255, 255)', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
            <View className="h-['90%'] w-'100%']">
                <ScrollView>
                    <View className="flex-row w-['100%'] pl-4 pr-4 items-center justify-between bg-background-light dark:bg-background-dark " >
                        <Text onPress={() => router.navigate('/(tabs)/(account)/login')} className="w-['33%']"><Ionicons name="arrow-back-outline" size={28} color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}/></Text>
                    </View>
                    <View className="flex-1 w-['100%'] h-['90%'] mt-8 items-center justify-start bg-background-light dark:bg-background-dark " >
                        <View className="w-['95%'] h-['95%'] items-center justify-start mb-10 rounded-2xl p-8">
                            <Text className="text-4xl font-semibold text-text-light dark:text-text-dark mb-10 ">Register</Text>
                            <ThemedTextInput autoCapitalize="none" placeholder={"First name"} value={firstName} onChangeText={setFirstName} keyboard={"email-address"}/>
                            {firstNameError &&
                                <Text className="text-sm w-['95%'] text-errorBtn-light">{firstNameErrorMessage}</Text>
                            }
                            <ThemedTextInput autoCapitalize="none" placeholder={"Last name"} value={lastName} onChangeText={setLastName} keyboard={"email-address"}/>
                            {lastNameError &&
                                <Text className="text-sm w-['95%'] text-errorBtn-light">{lastNameErrorMessage}</Text>
                            }
                            <ThemedTextInput autoCapitalize="none" placeholder={"Username"} value={userName} onChangeText={setUserName} keyboard={"email-address"}/>
                            {userNameError &&
                                <Text className="text-sm w-['95%'] text-errorBtn-light">{userNameErrorMessage}</Text>
                            }
                            <ThemedTextInput autoCapitalize="none" placeholder={"Email"} value={email} onChangeText={setEmail} keyboard={"email-address"}/>
                            {emailError &&
                                <Text className="text-sm w-['95%'] text-errorBtn-light">{emailErrorMessage}</Text>
                            }
                            <ThemedTextInput placeholder={"Password"} value={password} onChangeText={setPassword} secureTextEntry={true}/>
                            {passwordError &&
                                <Text className="text-sm w-['95%'] text-errorBtn-light">{passwordErrorMessage}</Text>
                            }
                            <ThemedTextInput placeholder={"Confirm password"} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true}/>
                            {confirmPasswordError &&
                                <Text className="text-sm w-['95%'] mb-4 text-errorBtn-light">{confirmPasswordErrorMessage}</Text>
                            }
                            <ThemedButton title={"Register"} icon={<Ionicons name="log-in-outline" size={18} />} onPress={register}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
            </SafeAreaView>
        </Fragment>
        
        
    )
}