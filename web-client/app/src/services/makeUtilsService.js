import {parse as esParse} from "esprima";

export const makeUtilsService = () => {
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
        ).format(new Date(timestamp * 1000))
    };

    const generateId = () => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < charactersLength; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    };

    const getVarValueAsString = (code, varname) => {
        /* jslint evil: true */
        const Function = Object.getPrototypeOf(function () {
        }).constructor;
        const extractCode = new Function(`"use strict";
            ${code}
            return output;`)();

        // const extractCode = Function(`"use strict";
        //     ${code}
        //     return {
        //         ${varname}
        //     }`)();
        return extractCode[varname];
    };

    const extractValueByType = (decelerator, codeAsText) => {
        const returnValue = {
            name: decelerator.id.name
        };

        switch (decelerator.init.type) {
            case "ObjectExpression":
                returnValue.type = "object";
                returnValue.defaultValue = getVarValueAsString(codeAsText, decelerator.id.name);
                break;
            case "ArrayExpression":
                returnValue.type = "array";
                returnValue.defaultValue = getVarValueAsString(codeAsText, decelerator.id.name);
                break;
            case "Literal":
                returnValue.type = typeof decelerator.init.value;
                returnValue.defaultValue = decelerator.init.value;
                break;
            default:
                returnValue.type = decelerator.init.type
                returnValue.defaultValue = 'NA'
                break;
        }

        return returnValue;

    };

    const extractArgumentsFromTextCode = (codeAsText) => {
        let variables = [];
        let parsed = esParse(codeAsText);
        parsed.body.forEach(ele => {
            if (ele.type === "VariableDeclaration") {
                ele.declarations.forEach(decelerator => {
                    variables.push(extractValueByType(decelerator, codeAsText))
                })
            }
        });
        return variables;
    };

    const checkCodeValidity = (codeAsText) => {
        try {
            esParse(codeAsText);
            return null;
        } catch (e) {
            return e;
        }
    };

    return Object.freeze({
        formatTimeStampToString,
        generateId,
        extractArgumentsFromTextCode,
        checkCodeValidity
    });
};

