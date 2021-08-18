const mockPassport = () => {
    const use = (cb) => {
        if (cb.name === "initialize") {
            console.log("hello");
        }
    };

    const serializeUser = (cb) => {
        if (cb.name === "initialize") {
            console.log("hello");
        }
    };

    const deserializeUser = (cb) => {
        if (cb.name === "initialize") {
            console.log("hello");
        }
    };

    const authenticate = (type) => {
        return (req, res, next) => {
            next();
        };
    };

    return Object.freeze({
        use,
        serializeUser,
        deserializeUser,
        authenticate
    });
};

Object.assign(module.exports, {
    mockPassport
});