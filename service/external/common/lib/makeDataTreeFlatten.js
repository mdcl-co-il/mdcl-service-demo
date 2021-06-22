const makeDataTreeFlatten = () => {

    const addParentPathToObject = (parentKey, obj) => {
        let returnObj = {};
        for (let key in obj) {
            returnObj[`${parentKey}.${key}`] = obj[key];
        }
        return returnObj;
    };

    const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

    const flattenMyObject = (obj, parentKeys = []) => {
        let flatArray = [];
        // check if one of the keys has array
        let isObjectFlat = true;
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
                // raise flag if array child found
                isObjectFlat = false;
                let objClone = deepClone(obj);
                // clean all other arrays children:
                for (let cloneKey in objClone) {
                    if (objClone.hasOwnProperty(cloneKey) && cloneKey !== key && Array.isArray(objClone[cloneKey])) {
                        objClone[cloneKey] = null;
                    }
                }
                // create nested key array
                const newKeyArray = deepClone(parentKeys);
                newKeyArray.push(key);

                // create clean clone for object merge later
                const cleanClone = deepClone(objClone);
                delete cleanClone[key];

                // create new child for each array item
                for (let i = 0; i < objClone[key].length; i++) {
                    const item = Object.assign({}, cleanClone, addParentPathToObject(newKeyArray.join('.'), objClone[key][i]));
                    // call flat recursively to handle nesting arrays
                    // if child has children it will return array
                    const flatItem = flattenMyObject(item, parentKeys);
                    if (Array.isArray(flatItem)) {
                        // if child has children
                        flatArray = flatArray.concat(flatItem);
                    } else {
                        // else just get the object back
                        flatArray.push(flatItem);
                    }
                }
                obj[key] = null;
            }
        }

        if (isObjectFlat) {
            return obj;
        } else {
            return flatArray.length === 1 ? flatArray[0] : flatArray;
        }
    };

    return Object.freeze({
        flattenMyObject
    });
}


Object.assign(module.exports, {
    makeDataTreeFlatten
})