const makeDbService = (mongoose, mongo) => {
    const init = async (app) => {
        await mongoose.connect(mongo.connUrl, {useNewUrlParser: true, useUnifiedTopology: true});
    };

    return Object.freeze({
        init
    });
}

Object.assign(module.exports, {
    makeDbService
})