const makeTokenModel = () => {
    return Object.freeze({
        Token: {
            username: String,
            rtoken: String
        }
    });
};


Object.assign(module.exports, {
    makeTokenModel
})
