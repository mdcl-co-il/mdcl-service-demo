export const makeHttpService = (axios, authSvc) => {

    axios.interceptors.request.use(
        request => {
            const loginInfo = authSvc.getLoginInfo();
            if (loginInfo) {
                request.headers.Authorization = 'Bearer ' + loginInfo.accessToken;
            }
            return request;
        },
        error => {
            console.log(error)
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(response => {
        return response;
    }, async error => {
        if (error.response.status === 403 || error.config.hasOwnProperty("retryOn401")) {
            authSvc.localLogout();
            window.location.replace("/login");
            return error;
        }
        if (error.response.status === 401) {
            const accessToken = await authSvc.refreshToken();
            if (accessToken) {
                error.config.headers['Authorization'] = 'Bearer ' + accessToken;
                error.config.baseURL = undefined;
                error.config.retryOn401 = 1;
                return axios.request(error.config);
            } else {
                return error;
            }
        }
        return error;
    });

    return Object.freeze({
        post: axios.post,
        get: axios.get
    });
};

