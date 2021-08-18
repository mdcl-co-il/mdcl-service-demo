const makeDbService = (mongoose, MongoClient) => {
    const init = async (app) => {
        await MongoClient.Connection.init();
        await mongoose.connect(MongoClient.Mongo.connUrl, {useNewUrlParser: true, useUnifiedTopology: true});
    };

    return Object.freeze({
        init
    });
}

Object.assign(module.exports, {
    makeDbService
})