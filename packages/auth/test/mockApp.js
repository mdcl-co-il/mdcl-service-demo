const mockApp = () => {
    let useCalled = 0;
    const getUsedCalled = () => {
        return useCalled;
    };
    const use = (cb) => {
        if (cb.name === "initialize") {
            useCalled++
        }
    };

    return Object.freeze({
        use,
        getUsedCalled
    });
};

Object.assign(module.exports, {
    mockApp
});