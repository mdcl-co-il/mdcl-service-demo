const fs = require('fs');
const path = require('path');

class ConfigLoader {

    constructor(env, configRoot) {
        this.env = env;
        this.configRoot = configRoot;
    }

    getGlobalConfig(sectionName, defaultValue) {
        return this.getConfigValue(path.resolve(this.configRoot, this.env), sectionName, defaultValue)
    }

    getServiceConfig(sectionName, defaultValue) {
        return this.getConfigValue(path.resolve(this.configRoot, this.env, "services"), sectionName, defaultValue)
    }

    getConfigValue(basePath, sectionName, defaultValue) {
        try {
            const splitSections = sectionName.split(".");
            // try load file:
            const fileToLoad = path.join(basePath, splitSections[0] + ".json");
            // remove first element (file name)
            splitSections.shift();

            let rawdata = fs.readFileSync(fileToLoad);
            let fullConfigObj = JSON.parse(rawdata);
            let returnObject = fullConfigObj;

            for (let i = 0; i < splitSections.length; i++) {
                returnObject = returnObject[splitSections[i]];
            }
            if (returnObject === undefined)
                return defaultValue;
            return returnObject;
        } catch (e) {
            return defaultValue;
        }
    }
}

module.exports = Object.freeze({
    ConfigLoader
})
