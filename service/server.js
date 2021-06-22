const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const {ConfigLoader} = require("./external/config-loader");
const port = process.env.PORT || 3030;
const {graphQlServer, init: graphQlServerInit} = require('./src/graphql');
const {LoggerService} = require('./src/services');

const SERVICE_NAME = "demo";
const serviceConfig = ConfigLoader.getServiceConfig(SERVICE_NAME);
const {DbService} = require('./src/services').init(serviceConfig);

const MainServer = async (app) => {
    await DbService.init(app);
    await graphQlServerInit(serviceConfig);
    graphQlServer().applyMiddleware({app, path: '/form/graphql'});
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
        graphQlServer().applyMiddleware({app, path: '/form/playground'});
    }
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

MainServer(app)
    .then(() => {
        app.listen(port);
        const msg = `${SERVICE_NAME} service is listening on port ${port}`;
        console.log(msg);
        LoggerService().logger.info(msg);
    })
    .catch(err => {
        console.log(err);
        LoggerService().logger.error(err);
    })
