export const makeUserService = (httpSvc) => {
    let userProfile;

    const loadProfile = async () => {
        const response = await httpSvc.get('/idp/user/profile');
        userProfile = response.data;
        return userProfile;
    };

    const profile = () => {
        return userProfile;
    };

    return Object.freeze({
        loadProfile,
        profile
    });
};

