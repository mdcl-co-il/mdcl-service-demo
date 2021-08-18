const makeUserModel = () => {
    const User = {
        name: String,
        lastName: String,
        email: String,
        authLevel: Number,
        system: Number
    };

    return Object.freeze({
        User
    });
};


Object.assign(module.exports, {
    makeUserModel
})
