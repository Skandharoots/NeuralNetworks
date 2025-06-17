import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Appearance, Pressable, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";
import ThemedButtonIrish from "./ThemedButtonIrish";
import ThemedTextInput from "./ThemedTextInput";


export default function UpdateAccountModal({ setIsUpdateOpen }: any) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastNameError, setLastNameError] = useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorMessage, setUserNameErrorMessage] = useState('');

    const { authState, onLogout } = useAuth();
    const router = useRouter()

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

        return isValid;

    }

    const updateUser = async () => {
        if (!validate())
            return;
        if (SecureStore.getItem('jwtToken') === undefined || SecureStore.getItem('jwtToken') === null)
            return;
        axios.put('/api/users/me', {
            first_name: firstName,
            last_name: lastName,
            username: userName,
            email: email,
        }, {
            headers: {
                'Authorization': 'Bearer ' + SecureStore.getItem('jwtToken')
            }
            
        }).then(async () => {
            if (onLogout) {
                await onLogout();
            }
            setIsUpdateOpen(false);
            router.navigate('/(tabs)/(account)/login')
            alert('Profile updated');
        }).catch(e => {
            alert(e.response.data)
        })
    }

    return (
        <>
            <Pressable onPress={() => setIsUpdateOpen(false)} className="h-['100%'] w-['100%'] bg-background-light dark:bg-background-dark absolute bottom-0">
                <Animated.View
                    className="w-['100%'] h-['100%'] bottom-0 fixed gap-3.5 p-8 rounded-t-3xl bg-background-light dark:bg-background-dark justify-center items-center"
                    entering={FadeIn.springify().damping(15)}
                    exiting={FadeOut.springify().damping(15)}
                >
                    <Ionicons
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 20,
                        }}
                        name={"close-outline"}
                        size={32}
                        color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}/>
                    <Text className="text-4xl font-semibold text-text-light dark:text-text-dark mb-10 ">Update account</Text>
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
                <ThemedButtonIrish title={"Update"} icon={<Ionicons name="create-outline" size={18} />} onPress={updateUser}/>
                </Animated.View>
            </Pressable>
        </>
    )

}