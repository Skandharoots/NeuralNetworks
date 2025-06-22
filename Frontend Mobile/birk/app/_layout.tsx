import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from "expo-router";
 
import axios from 'axios';
import { Platform } from 'react-native';
import AuthProvider from './context/AuthContext';
import './globals.css';

export default function App() {

  const LOCALHOST = Platform.OS === 'ios' ? 'http://127.0.0.1:8000' : 'http://10.0.2.2:8000';

  axios.defaults.baseURL = "http://192.168.100.18:8000";
  axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  axios.defaults.headers["Access-Control-Allow-Origin"] = "http://localhost:8081";
  axios.defaults.withCredentials = true;

  const Layout = () => {
    return (
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'Birk',
            headerShown: false, // Hide the header for the tabs
            headerStyle: { backgroundColor: '#f8f8f8' },
            headerTintColor: '#333',
            headerTitleStyle: { fontWeight: 'bold' },
            headerRight: () => (
              <Ionicons name="settings-outline" size={24} color="#333" style={{ marginRight: 10 }} />
            ),
          }}
        />
      </Stack>
    )
  }

  return ( 
      <AuthProvider>
        <Layout></Layout>
      </AuthProvider>
    )
}
