import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

/**TODO: Fix it for the new backend */

interface AuthProps {
    authState?: { 
        userName: string | null,
        token: string | null,
        authenticated: boolean | null,
        validUntil?: number | null,
        refreshUntil?: number | null,
        refreshToken?: string | null
    };
    onRegister?: (firstName: string, lastName: string, userName: string, email: string, password: string) => Promise<any>;
    onLogin?: (userName: string, password: string) => Promise<any>;
    onRefresh?: (refreshToken: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt_token";
const REFRESH_TOKEN = "refresh_token";
const REFRESH_UNTIL = "refresh_until";
const VALID_UNTIL = "valid_until";
const USER_NAME = "user_name";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    
    const [authState, setAuthState] = useState<{
        userName: string | null,
        token: string | null,
        authenticated: boolean | null,
        validUntil?: number | null,
        refreshUntil?: number | null,
        refreshToken?: string | null,
    }>({
        userName: null,
        token: null,
        authenticated: null,
        validUntil: null,
        refreshUntil: null,
        refreshToken: null,
    });

    useEffect(() => {
        const loadUser = async () => {
            const token = SecureStore.getItem("jwt_token");
            const user = SecureStore.getItem("user_name");
            const refreshToken = SecureStore.getItem("refresh_token");
            const valid = SecureStore.getItem("valid_until");
            const refresh = SecureStore.getItem("refresh_until");
            if (token && user && refreshToken && valid && refresh) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    userName: user,
                    token: token,
                    authenticated: true,
                    validUntil: parseInt(valid),
                    refreshUntil: parseInt(refresh),
                    refreshToken: refreshToken,
                })
            }
        };
        loadUser();
    }, []);

    const login = async (userName: string, password: string) => {
        try {
            const result = await axios.post(`/users/login/`, {
                username: userName,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const valid = Date.now() + (1000 * 60 * 60 * 24); // 1 day validity
            const refreshUntil = Date.now() + (1000 * 60 * 60 * 24 * 31); // 30 days validity for refresh token
            setAuthState({
                userName: result.data.username,
                token: result.data.access,
                authenticated: true,
                validUntil: valid,
                refreshUntil: refreshUntil,
                refreshToken: result.data.refresh,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.access}`;

            await SecureStore.setItemAsync(USER_NAME, result.data.username);
            await SecureStore.setItemAsync(VALID_UNTIL, valid.toString());
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access);
            await SecureStore.setItemAsync(REFRESH_UNTIL, refreshUntil.toString());
            await SecureStore.setItemAsync(REFRESH_TOKEN, result.data.refresh);

            return result;
        } catch (error) {
            return { error: true, msg: error }
        }
    };

    const register = async (firstName: string, lastName: string, userName: string, email: string, password: string) => {
        try {
            return await axios.post(`/users/register/`, {
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

    const refresh = async (refreshToken: string) => {
        try {
            const result = await axios.post(`/users/refresh`, {}, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            const token = result.data.token;
            const valid = Date.now() + (1000 * 60 * 60 * 24); // 1 day validity
            
            setAuthState((prevState) => ({
                ...prevState,
                token,
                validUntil: valid
            }));

        } catch (error) {
            return { error: true, msg: (error as any).response.data.message }
        }
        
    }

    const checkActive = async () => {
        const valid = await SecureStore.getItemAsync(VALID_UNTIL);
        const refreshUntil = await SecureStore.getItemAsync(REFRESH_UNTIL);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
        let now = new Date().getTime();

        if (refreshUntil && parseInt(refreshUntil) < now) {
            logout();
        } else {
            if (valid && parseInt(valid) < now && refreshToken) {
                await refresh(refreshToken);
            }
        }

    }

    const logout = async () => {

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_NAME);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(VALID_UNTIL);
        await SecureStore.deleteItemAsync(REFRESH_UNTIL);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            userName: null,
            token: null,
            authenticated: null,
            validUntil: null,
            refreshUntil: null,
            refreshToken: null
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onRefresh: checkActive,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;