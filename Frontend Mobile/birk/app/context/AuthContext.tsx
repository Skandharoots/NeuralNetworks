import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import {useRouter} from "expo-router";

interface AuthProps {
    authState?: { 
        userName: string | null,
        userId: number | null,
        token: string | null,
        authenticated: boolean | null,
        validUntil?: number | null,
    };
    onRegister?: (firstName: string, lastName: string, userName: string, email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    onCheck?: () => Promise<any>;
}

const TOKEN_KEY = "jwtToken";
const VALID_UNTIL = "validUntil";
const USER_NAME = "userName";
const USER_ID = "userId";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    
    const [authState, setAuthState] = useState<{
        userName: string | null,
        userId: number | null,
        token: string | null,
        authenticated: boolean | null,
        validUntil?: number | null,
    }>({
        userName: null,
        userId: null,
        token: null,
        authenticated: null,
        validUntil: null,
    });

    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = SecureStore.getItem("jwtToken");
            const user = SecureStore.getItem("userName");
            const valid = SecureStore.getItem("validUntil");
            const id = SecureStore.getItem("userId");
            if (token && user && valid && id) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    userName: user,
                    userId: parseInt(id),
                    token: token,
                    authenticated: true,
                    validUntil: parseInt(valid),
                })
            }
        };
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`/api/auth/login`, {
                username: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.access_token}`;
            const valid = Date.now() + (1000 * 60 * 1140);
            setAuthState({
                userName: result.data.username,
                userId: result.data.id,
                token: result.data.access_token,
                authenticated: true,
                validUntil: valid,
            });

            await SecureStore.setItemAsync(VALID_UNTIL, valid.toString());
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access_token);

            await getMe();

            return result;
        } catch (error) {
            return { error: true, msg: error }
        }
    };

    const getMe = async () => {
        try {
            const result = await axios.get(`/api/users/me`, {});
            await SecureStore.setItemAsync(USER_NAME, result.data.username);
            await SecureStore.setItemAsync(USER_ID, result.data.id);
            return result;
        } catch (error) {
            return { error: true, msg: error }
        }
    }

    const register = async (firstName: string, lastName: string, userName: string, email: string, password: string) => {
        try {
            return await axios.post(`/api/users/register`, {
                first_name: firstName,
                last_name: lastName,
                username: userName,
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        } catch (error) {
            return { error: true, msg: error }
        }
    }

    const checkActive = async () => {
        let now = Date.now();
        let validUntil = new Date(parseInt(authState.validUntil as unknown as string, 10)).getTime()
        if (validUntil && (validUntil - now < 0)) {
            await logout();
            console.log(false)
            return false;
        }
        console.log(true)
        return true;
    }

    const logout = async () => {

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_NAME);
        await SecureStore.deleteItemAsync(USER_ID);
        await SecureStore.deleteItemAsync(VALID_UNTIL);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            userName: null,
            userId: null,
            token: null,
            authenticated: null,
            validUntil: null,
        })
        router.navigate('/(tabs)/(account)/login')
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onCheck: checkActive,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;