const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3005;
const {graphQlServer} = require('./src/graphql');
const {LoggerService} = require('./src/services');
const {PassportService, DbService} = require('./src/services').init(app);

const MainServer = async (app) => {
    await DbService.init(app);
    await PassportService.init(app);
    app.use('/form/graphql', PassportService.authMiddleware(), (req, res, next) => {
        next();
    });
    graphQlServer.applyMiddleware({app, path: '/form/graphql'});
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
        graphQlServer.applyMiddleware({app, path: '/form/playground'});
    }
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

MainServer(app)
    .then(() => {
        app.listen(port);
        const msg = `Form service is listening on port ${port}`;
        console.log(msg);
        LoggerService.logger.info(msg);
    })
    .catch(err => {
        console.log(err);
        LoggerService.logger.error(err);
    })
