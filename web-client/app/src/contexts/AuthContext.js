import {createContext, useCallback, useContext, useEffect, useReducer} from "react";
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

export const ACTIONS = {
    SET_LOGIN_VALUE: 'set-login-value',
    SET_USER: 'set-user',
    SET_ACCESS_TOKEN: 'set-access-token',
    SET_REFRESH_TOKEN: 'set-refresh-token',
    SET_PROFILE: 'set-profile',
    SET_AUTH_CONTEXT_READY: 'set-auth-context-ready'
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOGIN_VALUE:
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn
            }
        case ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload.user
            }
        case ACTIONS.SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.payload.accessToken
            }
        case ACTIONS.SET_REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: action.payload.refreshToken
            }
        case ACTIONS.SET_PROFILE:
            return {
                ...state,
                profile: action.payload.profile
            }
        case ACTIONS.SET_AUTH_CONTEXT_READY:
            return {
                ...state,
                authContextReady: action.payload.authContextReady
            }
        default:
            return state;
    }
};

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthContextProvider({children}) {
    const history = useHistory();
    const [state, dispatch] = useReducer(reducer, {
        isLoggedIn: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        profile: null,
        authContextReady: false
    });

    useEffect(() => {
        if (state.authContextReady && state.isLoggedIn) {

        }
    }, [state]);

    const login = useCallback((accessToken, refreshToken, user, redirect = false) => {
        dispatch({type: ACTIONS.SET_ACCESS_TOKEN, payload: {accessToken}});
        dispatch({type: ACTIONS.SET_REFRESH_TOKEN, payload: {refreshToken}});
        dispatch({type: ACTIONS.SET_USER, payload: {user}});
        localStorage.setItem(
            "loginData",
            JSON.stringify({
                accessToken,
                refreshToken,
                user
            })
        );
        dispatch({type: ACTIONS.SET_LOGIN_VALUE, payload: {isLoggedIn: true}});
        dispatch({type: ACTIONS.SET_AUTH_CONTEXT_READY, payload: {authContextReady: true}});
    }, []);


    const logout = useCallback(() => {
        dispatch({type: ACTIONS.SET_ACCESS_TOKEN, payload: {accessToken: null}});
        dispatch({type: ACTIONS.SET_REFRESH_TOKEN, payload: {refreshToken: null}});
        dispatch({type: ACTIONS.SET_USER, payload: {user: null}});
        dispatch({type: ACTIONS.SET_PROFILE, payload: {profile: null}});
        localStorage.removeItem("loginData");
        localStorage.removeItem("profileData");
        dispatch({type: ACTIONS.SET_LOGIN_VALUE, payload: {isLoggedIn: false}});
        dispatch({type: ACTIONS.SET_AUTH_CONTEXT_READY, payload: {authContextReady: true}});
        history.push('/login');
    }, [history]);

    const setProfileData = useCallback((data) => {
        dispatch({type: ACTIONS.SET_PROFILE, payload: {profile: data}});
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
            dispatch({type: ACTIONS.SET_LOGIN_VALUE, payload: {isLoggedIn: true}});
            dispatch({type: ACTIONS.SET_AUTH_CONTEXT_READY, payload: {authContextReady: true}});
        } else {
            dispatch({type: ACTIONS.SET_LOGIN_VALUE, payload: {isLoggedIn: false}});
            dispatch({type: ACTIONS.SET_AUTH_CONTEXT_READY, payload: {authContextReady: true}});
            history.push("/login")
        }
        const storedProfileData = JSON.parse(localStorage.getItem("profileData"));
        if (
            storedProfileData
        ) {
            setProfileData(storedProfileData);
        }
    }, [login, setProfileData, history]);

    return (
        <AuthContext.Provider value={{
            isLoggedIn: !!state.accessToken,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            user: state.user,
            profile: state.profile,
            login: login,
            logout: logout,
            setProfileData: setProfileData
        }}>
            {children}
        </AuthContext.Provider>
    );
}