const makeConnection = (connectionConfig, client) => {
    let _client;
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

    const init = async () => {
        _client = await client.connect(getDbConnectionString(connectionConfig), {useNewUrlParser: true, useUnifiedTopology: true})
            .catch(err => {
                console.log(err);
            });
    };

    const db = () => {
        return _client.db(connectionConfig.dbname);
    };

    return Object.freeze({
        init,
        db
    });
}


Object.assign(module.exports, {
    makeConnection
})