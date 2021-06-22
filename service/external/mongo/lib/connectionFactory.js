function makeMongoConnection(connectionConfig, client, mongoose) {
    const getDbConnectionString = (connectionInfo) => {
        let connStr = "mongodb";
        if (connectionInfo.dns_srv) {
            connStr += "+srv";
        }
        connStr += "://";
        if (connectionInfo.username !== "" && connectionInfo.password !== "") {
            connStr += `${connectionInfo.username}:${connectionInfo.password}@`;
        }

        connStr += connectionInfo.host;
        if (connectionInfo.port !== "") {
            connStr += `:${connectionInfo.port}`;
        }

        connStr += `/${connectionInfo.dbname}?retryWrites=true&w=majority`;
        return connStr;
    };

    const connUrl = getDbConnectionString(connectionConfig);

    const connectMongoose = async () => {
        return await mongoose.connect(connUrl, {useMongoClient: true, useNewUrlParser: true, useUnifiedTopology: true});
    };

    return Object.freeze({
        connUrl,
        connectMongoose,
        client
    })
}

Object.assign(module.exports, {
    makeMongoConnection
})
