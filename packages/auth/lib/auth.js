const makeAuth = (passport, passportJWT, LocalStrategy, User, accessTokenSecret) => {
    const JWTStrategy = passportJWT.Strategy;
    const ExtractJWT = passportJWT.ExtractJwt;

    const init = async (app) => {
        app.use(passport.initialize());
        passport.use(new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            User.authenticate()
        ));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        passport.use(new JWTStrategy({
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: accessTokenSecret
            },
            function (jwtPayload, cb) {

                //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
                return User.findById(jwtPayload.id)
                    .then(user => {
                        return cb(null, user);
                    })
                    .catch(err => {
                        return cb(err);
                    });
            }
        ));
    };


    return Object.freeze({
        init,
        authMiddleware: () => passport.authenticate('jwt', {session: false})
    });
};

Object.assign(module.exports, {
    makeAuth
});
