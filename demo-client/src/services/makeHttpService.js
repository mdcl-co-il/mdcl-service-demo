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

    return Object.freeze({
        post: axios.post,
        get: axios.get
    });
};

