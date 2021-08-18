const makeRtokensDal = (mongoose, logger) => {
    const model = mongoose.model("Token");

    const searchToken = async (search) => {
        return model.findOne(search).exec();
    };

    async function insert(uid, token) {
        try {
            let tokendata = await searchToken({username: uid});
            if (!tokendata) {
                tokendata = new model({
                    username: uid,
                    rtoken: token
                });
            } else {
                tokendata.rtoken = token;
            }

            await tokendata.save();

        } catch (e) {
            logger.error(e.stack)
            throw e.message
        }
    }

    async function checkIfTokenExists(token) {
        try {
            const tokendata = await searchToken({rtoken: token});
            return !!tokendata;
        } catch (e) {
            logger.error(e.stack)
            throw e.message
        }
    }

    async function deleteToken(username, rtoken) {
        try {
            const tokendata = await searchToken({
                username,
                rtoken
            });
            if(tokendata) {
                await tokendata.remove();
            }
        } catch (e) {
            logger.error(e.stack)
            throw e.message
        }
    }

    return Object.freeze({
        insert,
        checkIfTokenExists,
        deleteToken
    })
}

Object.assign(module.exports, {
    makeRtokensDal
})