const makeAuthController = (rtokensDal, User, passport, jwtSign, jwtVerify, accessTokenSecret, refreshTokenSecret, logger) => {
    const register = async (req, res) => {
        try {
            User.register(new User({
                username: req.body.username
            }), req.body.password, function (err, account) {
                if (err) {
                    logger.error('An error occurred: ' + err);
                    return res.status(500).send('An error occurred: ' + err);
                }

                passport.authenticate('local', {
                    session: false
                })(req, res, () => {
                    res.status(200).send('Successfully created new account');
                });
            });
        } catch (err) {
            logger.error('An error occurred: ' + err);
            return res.status(500).send('An error occurred: ' + err);
        }
    };

    const login = async (req, res) => {
        try {
            if (!req.body.username || !req.body.password) {
                return res.status(400).json({
                    message: 'Something is not right with your input'
                });
            }
            passport.authenticate('local', {session: false}, (err, user, info) => {
                if (err || !user) {
                    return res.status(401).json({
                        message: info.message
                    });
                }
                req.login(user, {session: false}, async (err) => {
                    if (err) {
                        logger.error('An login error occurred: ' + err);
                        res.send(err);
                    }

                    return res.json({
                        user: user.username,
                        accessToken: await generateAccessToken(user),
                        refreshToken: await generateRefreshToken(user)
                    });
                });
            })(req, res);
        } catch (err) {
            logger.error('An error occurred: ' + err);
        }
    };

    const token = async (req, res) => {
        const refreshToken = req.body.token;
        if (refreshToken == null)
            return res.sendStatus(401);
        try {
            const user = await parseRefreshToken(refreshToken)
            res.json({accessToken: await generateAccessToken(user)})
        } catch (e) {
            res.sendStatus(403)
        }
    };

    const logout = async (req, res) => {
        if (req.query.user && req.query.token) {
            try {
                await rtokensDal.deleteToken(req.query.user, req.query.token);
                res.status(200).send('logout success');
            } catch (err) {
                logger.error('An error occurred: ' + err);
                return res.status(500).send('An error occurred: ' + err);
            }
        } else {
            return res.status(400).json({
                message: 'Something is not right',
                query: req.query
            });
        }
    };

    const parseRefreshToken = async (token) => {
        return new Promise(async (resolve, reject) => {
            if (!await rtokensDal.checkIfTokenExists(token))
                reject();

            jwtVerify(token, refreshTokenSecret, (err, user) => {
                if (err)
                    reject()
                else {
                    resolve(user);
                }
            })
        })
    };

    const generateAccessToken = async (user) => {
        return jwtSign({id: user.id, username: user.username}, accessTokenSecret, {expiresIn: '30m'});
    };

    const generateRefreshToken = async (user) => {
        const refreshToken = jwtSign({id: user.id, username: user.username}, refreshTokenSecret);
        await rtokensDal.insert(user.username, refreshToken);
        return refreshToken
    };

    return Object.freeze({
        register,
        login,
        token,
        logout
    });
};


Object.assign(module.exports, {
    makeAuthController
})
