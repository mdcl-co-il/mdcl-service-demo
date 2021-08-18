const makeAuthRouter = (router, authCtrl) => {
    router.post('/register', (req, res) => {
        authCtrl.register(req, res);
    });

    router.post('/login', (req, res) => {
        authCtrl.login(req, res);
    });

    router.post('/token', (req, res) => {
        authCtrl.token(req, res);
    });

    router.delete('/logout', (req, res) => {
        authCtrl.logout(req, res);
    });

    return router;
};


Object.assign(module.exports, {
    makeAuthRouter
})
