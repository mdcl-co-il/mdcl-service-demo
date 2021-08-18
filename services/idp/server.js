const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3002;
const {LoggerService} = require('./src/services');
const {PassportService, DbService} = require('./src/services').init(app);
const {AuthRouter, UserRouter} = require('./src/routes');

const MainServer = async (app) => {
    await DbService.init(app);
    await PassportService.init(app);
    app.use('/idp/auth', AuthRouter);
    app.use('/idp/user', PassportService.authMiddleware(), UserRouter);
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

MainServer(app)
    .then(() => {
        app.listen(port);
        const msg = `IDP service is listening on port ${port}`;
        console.log(msg);
        LoggerService.logger.info(msg);
    })
    .catch(err => {
        console.log(err);
        LoggerService.logger.error(err);
    })
