const makeLoggerService = (mdclLogger, serviceConfig) => {

    const logger = mdclLogger.init({
        application: serviceConfig.applicationName
    });

    return Object.freeze({logger});
};


Object.assign(module.exports, {
    makeLoggerService
});