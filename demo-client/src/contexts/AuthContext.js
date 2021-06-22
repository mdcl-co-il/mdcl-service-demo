import {createContext, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    refreshToken: null,
    user: null,
    profile: null,
    login: () => {
    },
    logout: () => {
    },
    setProfileData: () => {
    }
});

export function AuthContextProvider({children}) {
    const history = useHistory();
    const [accessToken, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const login = useCallback((accessToken, refreshToken, user, redirect = false) => {
        setToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);
        localStorage.setItem(
            "loginData",
            JSON.stringify({
                accessToken,
                refreshToken,
                user
            })
        );
        if(redirect) {
            //history.goBack();
        } else {
            //history.push('')
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        setProfile(null);
        localStorage.removeItem("loginData");
        localStorage.removeItem("profileData");
        history.push("/v2/login");
    }, [history]);

    const setProfileData = useCallback((data) => {
        setProfile(data);
        localStorage.setItem(
            "profileData",
            JSON.stringify(data)
        );
    }, []);

    useEffect(() => {
        const storedLoginData = JSON.parse(localStorage.getItem("loginData"));
        if (
            storedLoginData &&
            storedLoginData.accessToken &&
            storedLoginData.refreshToken
        ) {
            login(storedLoginData.accessToken, storedLoginData.refreshToken);
        } else {
            //history.push("/v2/login");
        }
        const storedProfileData = JSON.parse(localStorage.getItem("profileData"));
        if (
            storedProfileData
        ) {
            setProfileData(storedProfileData);
        }
    }, [login, setProfileData]);

    return (
        <AuthContext.Provider value={{
            isLoggedIn: !!accessToken,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user,
            profile: profile,
            login: login,
            logout: logout,
            setProfileData: setProfileData
        }}>
            {children}
        </AuthContext.Provider>
    );
}