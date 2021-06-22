const {makeUtils} = require("./utils");
const {makeDataTreeFlatten} = require('./makeDataTreeFlatten');
Object.assign(module.exports, {
    Utils: makeUtils(),
    DataTreeFlatten: makeDataTreeFlatten()
})