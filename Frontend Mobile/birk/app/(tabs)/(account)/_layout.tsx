import { useAuth } from "@/app/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { Appearance } from "react-native";

const _Layout = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { authState } = useAuth();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

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
            </Tabs>
    )
}

export default _Layout;

