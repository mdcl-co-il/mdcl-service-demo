export const makeAuthService = (axios) => {
    const LOGIN_DATA_STORAGE_KEY = "loginData";

    const localLogout = () => {
        localStorage.removeItem("loginData");
        localStorage.removeItem("profileData");
    }

    const login = async (userName, pass) => {
        return await axios.post('/idp/auth/login', {
            username: userName,
            password: pass
        });
    };

    const logout = async (user, refreshToken) => {
        return await axios.delete(`/idp/auth/logout?user=${user}&token=${refreshToken}`);
    };

    const refreshToken = async () => {
        try {
            const loginInfo = getLoginInfo();
            const res = await axios.post('/idp/auth/token', {
                token: loginInfo.refreshToken
            });
            if (res.data && res.data.accessToken) {
                loginInfo.accessToken = res.data.accessToken;
                localStorage.setItem(
                    "loginData",
                    JSON.stringify(loginInfo)
                );
                return res.data.accessToken;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
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
        localLogout,
        getLoginInfo,
        refreshToken
    });
};

