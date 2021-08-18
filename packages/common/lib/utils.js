const {v4: uuidv4} = require('uuid');

const makeUtils = () => {
    const deepFind = (obj, path) => {
        let paths = path.split('.')
            , current = obj
            , i;

        for (i = 0; i < paths.length; ++i) {
            if (current[paths[i]] === undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }
    const mergeDeep = (target, ...sources) => {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target.hasOwnProperty(key))
                        Object.assign(target, {[key]: {}});
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }

        return mergeDeep(target, ...sources);
    };

    const isObject = (item) => {
        return (item && typeof item === 'object' && !Array.isArray(item));
    };

    const buildObjFromArr = (arr) => {
        const ret = {};
        const key = arr[0];
        if (arr.length === 1) {
            ret[key] = 1;
        } else {
            arr.shift();
            ret[key] = buildObjFromArr(arr);
        }
        return ret;
    };

    const getValuePathFromColPath = (colPath) => {
        const fieldSplit = colPath.split('___');
        const split = fieldSplit.filter((v, i) => {
            return i % 2 === 1;
        });
        return split.join('.');
    };

    const formatTimeStampToString = (timestamp) => {
        return new Intl.DateTimeFormat(
            'en',
            {
                weekday: 'long',
                month: 'long',
                year: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h23'
            }
        ).format(new Date(timestamp * 1000));
    };

    const formatDateString = (str) => {
        const d = Date.parse(str);
        let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
        let mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
        let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
        return `${da}-${mo}-${ye}`;
    };

    const GenerateGuid = () => {
        return uuidv4();
    };

    const GetCurrentUnixTime = () => {
        return Math.floor(+new Date() / 1000);
    };

    const normalizeMongoId = (obj) => {
        if (obj.hasOwnProperty("_id")) {
            obj.id = obj._id;
        }
        return obj;
    };

    return Object.freeze({
        deepFind,
        mergeDeep,
        isObject,
        buildObjFromArr,
        getValuePathFromColPath,
        formatTimeStampToString,
        formatDateString,
        GenerateGuid,
        GetCurrentUnixTime,
        normalizeMongoId
    });
};

Object.assign(module.exports, {
    makeUtils
})