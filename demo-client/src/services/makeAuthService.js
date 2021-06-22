export const makeAuthService = (axios) => {
    const LOGIN_DATA_STORAGE_KEY = "loginData";


    const login = async (userName, pass) => {
        return await axios.post('/idp/auth/login', {
            username: userName,
            password: pass
        });
    };

    const logout = async (user, refreshToken) => {
        return await axios.delete(`/idp/auth/logout?user=${user}&token=${refreshToken}`)
    };

    const getLoginInfo = () => {
        const loginData = localStorage.getItem(LOGIN_DATA_STORAGE_KEY);
        if (loginData) {
            return JSON.parse(loginData);
        }
        return null;
    };

    return Object.freeze({
        login,
        logout,
        getLoginInfo
    });
};

