const makeDbService = (MongoClient) => {
    const init = async (app) => {
        await MongoClient.Connection.init();
    };

    return Object.freeze({
        init
    });
}

Object.assign(module.exports, {
    makeDbService
})