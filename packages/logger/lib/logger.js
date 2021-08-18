const makeLogger = (structuredLog, levelSwitch, extraSink) => {
    let logger;
    const init = (enrichData) => {
        logger = structuredLog.configure()
            .minLevel(levelSwitch)
            .enrich(Object.assign(enrichData, {}))
            .writeTo(extraSink)
            .writeTo(new structuredLog.ConsoleSink())
            .create();

        const info = (obj) => {
            logger.info(obj)
        };

        const debug = (obj) => {
            logger.debug(obj)
        };

        const warn = (obj) => {
            logger.warn(obj)
        };

        const error = (obj) => {
            logger.error(obj)
        };
        return Object.freeze({
            info,
            debug,
            warn,
            error
        });
    };
    return Object.freeze({
        init
    });
};


Object.assign(module.exports, {
    makeLogger
});