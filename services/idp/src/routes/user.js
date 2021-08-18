const makeUserRouter = (router) => {
    router.get('/', function(req, res, next) {
        res.send('respond with a resource');
    });

    router.get('/profile', function(req, res, next) {
        res.send(req.user);
    });

    return router;
};


Object.assign(module.exports, {
    makeUserRouter
})
