import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import { Appearance } from "react-native";


const _Layout = ()=> {

    return (
            <Tabs
                screenOptions={{
                    headerShown: false, 
                    tabBarActiveTintColor: Appearance.getColorScheme() === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)', 
                    tabBarStyle: {
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        left: 0,
                        bottom: 30,
                        height: '5%',
                        paddingBottom: 0,
                        borderRadius: 60,
                        right: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                        borderTopWidth: 0,
                        paddingTop: 2,
                        marginHorizontal: 8,
                        elevation: 0,
                    },
                    tabBarItemStyle: {
                        borderRadius: 40,
                        marginHorizontal: 8,
                        marginBottom: 0,
                    },
                    tabBarIconStyle: {
                        marginBottom: 0,
                    },
                }}  
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="home-outline" size={24} color={color} />
                        )}}
                />
                <Tabs.Screen
                    name="(search)"
                    options={{
                        title: 'Search',
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="search-outline" size={24} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                name="(account)"
                options={{
                    title: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={24} color={color} /> 
                    )
                }}
                />
            </Tabs>
    )
}

export default _Layout;
