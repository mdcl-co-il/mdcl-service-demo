const loki = require('lokijs');

const makeReportService = (dal, loggerSvc) => {

    const removeNotListedIndex = (indexesToKeep, arr) => {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (indexesToKeep.indexOf(i) < 0) {
                arr.splice(i, 1);
            }
        }
        return arr;
    };

    const buildVariablesCodeAsText = (inputVariables, variables) => {
        let returnText = "";
        if (!variables) {
            return returnText;
        }
        let inVarsArray = [];
        let inVarsTypeArray = [];
        for (let inVar of inputVariables) {
            inVarsArray.push(inVar.name);
            inVarsTypeArray.push(inVar.type);
        }
        const wrapValue = (type, value) => {
            if (type === "string") {
                return `"${value}"`;
            }
            return value;
        };
        let i = 0;
        variables.forEach(variable => {
            if (inVarsArray.indexOf(variable.name) > -1) {
                returnText += `\n${variable.name}=${wrapValue(inVarsTypeArray[i], variable.value)};`;
            }
            i++;
        });
        return returnText;
    };

    const filterResults = (data, filterCodeAsText, inputVariablesCodeAsText, inputVariables, variables) => {
        const db = new loki('report.db');
        const lokiRows = db.addCollection('report');

        data.forEach(row => {
            lokiRows.insert(row);
        });

        let responseData = lokiRows.data;
        // find
        if (filterCodeAsText) {
            const variableOverrideCode = buildVariablesCodeAsText(inputVariables, variables);
            const fnTxt = `"use strict";
            ${inputVariablesCodeAsText}
            ${variableOverrideCode}
            ${filterCodeAsText}
            return {
                filter
            }`;
            const bindFilter = Function(fnTxt)();
            responseData = lokiRows.find(bindFilter.filter);
        }

        // flip back to rows
        let rows = [];
        responseData.forEach(lokiRow => {
            const row = [];
            for (let key in lokiRow) {
                if (lokiRow.hasOwnProperty(key) && key !== "meta" && key !== "$loki")
                    row.push(lokiRow[key]);
            }
            rows.push(row);
        });

        return rows;
    };

    const removeColumns = (rows, columns, visibleColumns) => {
        const rowIndexToKeep = [];
        for (let column of visibleColumns) {
            rowIndexToKeep.push(columns.indexOf(column.name))
        }
        return {
            columns: removeNotListedIndex(rowIndexToKeep, columns),
            rows: rows.map(row => removeNotListedIndex(rowIndexToKeep, row))
        }
    };

    const runReport = async (options) => {
        loggerSvc.logger.debug(`runReport start`);
        try {
            options = JSON.parse(options);
            loggerSvc.logger.debug(`runReport Pipe stage #1 started`);
            // Pipe stage #1 - reduce to one view
            const reportRows = await dal.getReportDataView(options.baseForm, options.allFields);
            loggerSvc.logger.debug(`runReport Pipe stage #2 started`);
            // Pipe stage #2 - filter rows out
            const filteredData = filterResults(reportRows.objectRows, options.findObject, options.inputVariablesText, options.inputVariables, options.variables);
            loggerSvc.logger.debug(`runReport Pipe stage #3 started`);
            // Pipe stage #3 - filter non-visible columns out
            const {columns, rows} = removeColumns(filteredData, reportRows.columns, options.visibleFields)
            loggerSvc.logger.debug(`runReport completed!`);
            return {
                columns,
                rows
            };
        } catch (e) {
            loggerSvc.logger.error(e);
            throw new Error(e);
        }
    };

    const saveReport = async (options, user) => {
        try {
            options = JSON.parse(options);
        } catch (e) {
            loggerSvc.logger.error(e);
            throw new Error('Cannot parse report options object');
        }

        try {
            return await dal.saveReport(options, user);
        } catch (e) {
            loggerSvc.logger.error(e);
        }
    };

    const getReports = async () => {
        return await dal.getReports();
    };

    const getReport = async (reportId) => {
        return await dal.getReport(reportId);
    };

    const deleteReport = async (reportId) => {
        return await dal.deleteReport(reportId);
    };

    return Object.freeze({
        runReport,
        saveReport,
        getReports,
        getReport,
        deleteReport
    });
}


Object.assign(module.exports, {
    makeReportService
})