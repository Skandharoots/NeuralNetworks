import { useAuth } from "@/app/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Appearance } from "react-native";

function _Layout() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { authState } = useAuth();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        authState?.authenticated ? router.navigate('/(tabs)/(account)/account') : router.navigate('/(tabs)/(account)/login')
    }, [authState, router])

    return (
            <Tabs
                screenOptions={{
                    headerShown: false, 
                    tabBarActiveTintColor: Appearance.getColorScheme() === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="log-in-outline" size={24} color={color} /> 
                    ),
                    tabBarStyle: {
                       display: 'none'
                    },
                    tabBarItemStyle: {
                        display: 'none'
                    },
                    tabBarIconStyle: {
                        display: 'none'
                    },
                }}  
            >
                    <Tabs.Screen
                    name="login"
                    options={{
                        title: 'Login',
                        }}
                />
                <Tabs.Screen
                    name="account"
                    options={{
                        title: 'Account',
                        }}
                />
                <Tabs.Screen
                    name="register"
                    options={{
                        title: 'Register',
                    }}
                />
            </Tabs>
    )
}

export default _Layout;

