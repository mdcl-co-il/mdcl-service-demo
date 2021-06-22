const {resolve} = require('path');
const fs = require("fs"); // Or `import fs from "fs";` with ESM

const env = process.env.NODE_ENV || 'development';
const configRoot = process.env.CONFIG_DIR || resolve(__dirname, "../../../config");
const {ConfigLoader} = require('./config.loader');

console.log("Config loader env: ", env);
console.log("Config loader configRoot: ", configRoot);
console.log(`${configRoot} exists?: `, fs.existsSync(configRoot));


Object.assign(module.exports, {
    ConfigLoaderClass: ConfigLoader,
    ConfigLoader: new ConfigLoader(env, configRoot)
});