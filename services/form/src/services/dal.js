const makeDal = (Mongo, models, utils, loggerSvc) => {

    const FORMS_COLLECTION = "SystemForms";
    const FORMS_FIELDS_COLLECTION = "SystemFormFields";
    const REPORTS_COLLECTION = "SystemReports";
    const USERS_COLLECTION = "users";
    const WIZARDS_COLLECTION = "SystemWizards";

    const formFillsCacheMap = {};
    const formFIllsCacheExpirationSec = 60;
    const formFieldsCacheMap = {};
    const formFieldCacheExpirationSec = 60;
    const usersCacheMap = {};
    const usersCacheExpirationSec = 300;

    const getUserInfo = async (userId) => {
        const db = Mongo.Connection.db();
        const usersCollection = db.collection(USERS_COLLECTION);
        return await usersCollection.findOne(Mongo.ObjectId(userId));
    };

    const getUserInfoCached = async (userId) => {
        const time = utils.GetCurrentUnixTime();
        let userInfo;
        if (usersCacheMap.hasOwnProperty(userId) && time - usersCacheMap[userId].timestamp <= usersCacheExpirationSec) {
            userInfo = usersCacheMap[userId].data;
            //loggerSvc.logger.debug(`getUser ${userId} loaded from cache`);
        } else {
            userInfo = await getUserInfo(userId);
            usersCacheMap[userId] = {
                data: userInfo,
                timestamp: time
            };
        }
        return userInfo;
    };

    const createNewForm = async (formData, user) => {
        const newFormId = utils.GenerateGuid();
        const title = formData.title ? formData.title : "New form - " + newFormId;
        const newFormData = {
            _id: newFormId,
            title: title,
            description: formData.description,
            createdBy: user?.id,
            creationDate: utils.GetCurrentUnixTime(),
            lastModifiedBy: user?.id,
            lastModifiedDate: utils.GetCurrentUnixTime()
        }
        const db = Mongo.Connection.db();
        const formsCollection = db.collection(FORMS_COLLECTION);
        await formsCollection.insertOne(newFormData);
        if (formData.hasOwnProperty("fields")) {
            const fields = formData.fields.map(field => {
                field.formId = newFormId;
                field._id = utils.GenerateGuid();
                return field;
            });
            const formsFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
            await formsFieldsCollection.insertMany(fields);
        }

        // create key field
        const newField = await addFormField(newFormId);
        const newFieldData = {
            name: "key",
            isKey: true
        };

        await updateFormField(newField._id, newFieldData);

        return await getForm(newFormId);
    };

    const getForm = async (formId) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        const formsFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
        const formData = utils.normalizeMongoId(await collection.findOne({_id: formId}));
        formData.fillCount = formData.fillData ? formData.fillData.length : 0;
        let formFields = await formsFieldsCollection.find({formId: formData.id}).toArray();
        //const keyField = null;
        const keyField = formFields.filter(field => field.isKey === true);
        if (keyField.length === 0) {
            const newField = await addFormField(formId);
            const newFieldData = {
                name: "key",
                isKey: true
            };
            await updateFormField(newField._id, newFieldData);
            formFields = await formsFieldsCollection.find({formId: formData.id}).toArray();
        }
        formData.fields = formFields.map(utils.normalizeMongoId);
        if (formData.createdBy) {
            formData.createdByUser = await getUserInfoCached(formData.createdBy);
        }
        if (formData.lastModifiedBy) {
            formData.lastModifiedByUser = await getUserInfoCached(formData.lastModifiedBy);
        }
        return formData;
    };

    const getFormFills = async (formId) => {
        //loggerSvc.logger.debug(`getFormFills ${formId} started`);
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        const formData = await collection.findOne({_id: formId});
        let fillData = formData.fillData ? formData.fillData : [];
        //loggerSvc.logger.debug(`getFormFills ${formId} formData done, fillData length: ${fillData.length}`);
        for (let fill of fillData) {
            fill.user = await getUserInfoCached(fill.user);
            fill.data = JSON.stringify(fill.data)
        }
        //loggerSvc.logger.debug(`getFormFills ${formId} formData users data added`);
        return fillData;
    };

    const getFormFillsCached = async (formId) => {
        const time = utils.GetCurrentUnixTime();
        let formFills;
        if (formFillsCacheMap.hasOwnProperty(formId) && time - formFillsCacheMap[formId].timestamp <= formFIllsCacheExpirationSec) {
            formFills = formFillsCacheMap[formId].data;
            //loggerSvc.logger.debug(`formFills ${formId} loaded from cache`);
        } else {
            formFills = await getFormFills(formId);
            formFillsCacheMap[formId] = {
                data: formFills,
                timestamp: time
            };
        }
        return formFills;
    };

    const getFormsList = async () => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        const forms = await collection.find({}).toArray();
        return forms.map(utils.normalizeMongoId).map(async formData => {
            const formsFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
            const formFields = await formsFieldsCollection.find({formId: formData.id}).toArray();
            formData.fields = formFields.map(utils.normalizeMongoId);
            formData.fillCount = formData.fillData ? formData.fillData.length : 0;
            if (formData.createdBy) {
                formData.createdByUser = await getUserInfoCached(formData.createdBy);
            }
            if (formData.lastModifiedBy) {
                formData.lastModifiedByUser = await getUserInfoCached(formData.lastModifiedBy);
            }
            return formData;
        });
    };

    const getReportFieldsListRecursive = async (formId, parentForm, linkFieldId = null, recursionLevel = 0) => {
        const recursionLimit = 2;
        if (recursionLevel >= recursionLimit) {
            return [];
        }
        let list = [];
        const db = Mongo.Connection.db();
        const formsFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
        const formFields = await formsFieldsCollection.find({formId}).toArray();

        for (let field of formFields) {
            const key = [parentForm, field.name].join('_').replace(" ", "-");

            switch (field.type) {
                case 6:
                    const extraData = JSON.parse(field.extraData);
                    const items = await getReportFieldsListRecursive(extraData.formId, key, field._id, recursionLevel + 1);
                    list = list.concat(items);
                    break;
                default:
                    list.push({
                        id: field._id,
                        linkFieldId,
                        name: key
                    });
            }
        }

        return list;
    };

    const getReportFieldsList = async (formId) => {
        const db = Mongo.Connection.db();
        const formsCollection = db.collection(FORMS_COLLECTION);
        const formData = await formsCollection.findOne({_id: formId});

        return await getReportFieldsListRecursive(formId, formData.title);
    };

    const buildFormIndexKeyList = async (fieldId, ignoreFillId = "NaN") => {
        const field = await getFormField(fieldId);
        const fills = await getFormFills(field.formId);
        return fills.filter(fill => fill.id !== ignoreFillId).map(fill => {
            const field = fill.dataMap.filter(field => field.fieldId === fieldId);
            if (field.length > 0) {
                return field[0].value;
            } else {
                return "NaN";
            }
        });
    };

    const checkUniqueKey = async (fieldId, value, ignoreFillId) => {
        const existsKeys = await buildFormIndexKeyList(fieldId, value, ignoreFillId);
        return existsKeys.indexOf(value) < 0;
    };

    const deleteForm = async (formId, user) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        await collection.deleteOne({_id: formId});
        const formFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
        await formFieldsCollection.deleteMany({formId: formId});
        const reportsCollection = db.collection(REPORTS_COLLECTION);
        await reportsCollection.deleteMany({baseForm: formId});
        return true;
    };

    const updateForm = async (formId, formData, user) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        delete formData._id;
        delete formData.fields;
        formData.lastModifiedBy = user?.id;
        formData.lastModifiedDate = utils.GetCurrentUnixTime();
        await collection.updateOne({_id: formId}, {$set: formData});
        return await getForm(formId);
    };

    const getFormField = async (fieldId) => {
        //loggerSvc.logger.debug(`getFormField ${fieldId} started`);
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_FIELDS_COLLECTION);
        const field = await collection.findOne({_id: fieldId});
        //loggerSvc.logger.debug(`getFormField ${fieldId} completed`);
        return field;
    };

    const getFormFieldCached = async (fieldId) => {
        const time = utils.GetCurrentUnixTime();
        let formField;
        if (formFieldsCacheMap.hasOwnProperty(fieldId) && time - formFieldsCacheMap[fieldId].timestamp <= formFieldCacheExpirationSec) {
            formField = formFieldsCacheMap[fieldId].data;
            //loggerSvc.logger.debug(`formField ${fieldId} loaded from cache`);
        } else {
            formField = await getFormField(fieldId);
            formFieldsCacheMap[fieldId] = {
                data: formField,
                timestamp: time
            };
        }
        return formField;
    };

    const addFormField = async (formId) => {
        const newId = utils.GenerateGuid();
        const newField = {
            _id: newId,
            type: 1,
            name: "new field",
            required: false,
            isKey: false,
            formId,
            extraData: "{}"
        };
        const db = Mongo.Connection.db();
        const formsFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
        await formsFieldsCollection.insertOne(newField);
        return await formsFieldsCollection.findOne({_id: newId});
    };

    const updateFormField = async (fieldId, data) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_FIELDS_COLLECTION);
        await collection.updateOne({_id: fieldId}, {$set: data});
        return await collection.findOne({_id: fieldId});
    };

    const deleteFormField = async (fieldId) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_FIELDS_COLLECTION);
        await collection.deleteOne({_id: fieldId});
        return true;
    };

    const fillForm = async (formId, dataMap, user) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        const data = {};
        for (let item of dataMap) {
            data[item.field] = item.value;
        }
        const fillData = {
            id: utils.GenerateGuid(),
            user: user?.id,
            date: utils.GetCurrentUnixTime(),
            data,
            dataMap
        };
        collection.updateOne(
            {_id: formId},
            {$addToSet: {fillData: fillData}}
        );
        return true;
    };

    const getFormFillLinkData = async (formId, fillId) => {
        //loggerSvc.logger.debug(`getFormFillLinkData ${formId} started`);
        const formFills = await getFormFillsCached(formId);
        const filtered = formFills.filter(fill => fill.id === fillId);
        //loggerSvc.logger.debug(`getFormFillLinkData ${formId} completed`);
        if (filtered.length === 1) {
            return filtered[0];
        } else {
            return null;
        }
    };

    const getReports = async () => {
        const db = Mongo.Connection.db();
        const collection = db.collection(REPORTS_COLLECTION);
        const reports = await collection.find({}).toArray();
        return await Promise.all(reports.map(utils.normalizeMongoId).map(async reportData => {
            if (reportData.createdBy) {
                reportData.createdByUser = await getUserInfoCached(reportData.createdBy);
            }
            if (reportData.lastModifiedBy) {
                reportData.lastModifiedByUser = await getUserInfoCached(reportData.lastModifiedBy);
            }
            return reportData;
        }));
    };

    const getReport = async (reportId) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(REPORTS_COLLECTION);
        return utils.normalizeMongoId(await collection.findOne({_id: reportId}));
    };

    const deleteReport = async (reportId) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(REPORTS_COLLECTION);
        await collection.deleteOne({_id: reportId});
        return true;
    };

    const getReportDataView = async (baseFormId, fieldsList) => {
        //loggerSvc.logger.debug(`getReportDataView baseFormId:${baseFormId} started`);
        const formFills = await getFormFillsCached(baseFormId);
        const columns = [];
        const columnsTitles = [];

        // prepare columns data
        for (let field of fieldsList) {
            const reportFieldId = field.linkFieldId ? field.linkFieldId : field.id;
            columns.push({
                reportFieldId,
                name: field.name,
                mappedId: field.id,
                fieldDef: await getFormFieldCached(reportFieldId)
            });
            columnsTitles.push(field.name);
        }

        // get all data in columns
        let columnIndex = 0;
        let columnarData = [];
        for (let column of columns) {
            columnarData[columnIndex] = []
            for (let fill of formFills) {
                let value = "NA";
                const filteredValue = fill.dataMap.filter(fieldValue => fieldValue.fieldId === column.reportFieldId);
                if (filteredValue.length === 1 && filteredValue[0].value) {
                    value = filteredValue[0].value;
                }
                if (value && value !== "NA" && column.fieldDef.type === 6) {
                    const extraData = JSON.parse(column.fieldDef.extraData);
                    const linkedData = await getFormFillLinkData(extraData.formId, value);
                    if (linkedData.dataMap.filter(fieldValue => fieldValue.fieldId === column.mappedId).length < 1) {
                        value = "NA";
                    } else {
                        value = linkedData.dataMap.filter(fieldValue => fieldValue.fieldId === column.mappedId)[0].value;
                    }
                }
                columnarData[columnIndex].push(value);
            }
            columnIndex++;
        }

        // flip to rows data for presentation
        let rows = [];
        let objectRows = [];
        const rowsCount = columnarData.length > 0 ? columnarData[0].length : 0;
        for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
            rows[rowIndex] = [];
            objectRows[rowIndex] = {};
            for (let colIndex = 0; colIndex < columnarData.length; colIndex++) {
                rows[rowIndex][colIndex] = columnarData[colIndex][rowIndex];
                objectRows[rowIndex][columns[colIndex].name] = columnarData[colIndex][rowIndex];
            }
        }
        //loggerSvc.logger.debug(`getReportDataView baseFormId:${baseFormId} completed`);
        return {
            columns: columnsTitles,
            rows,
            objectRows
        };
    };

    const createNewEntityReport = async (options, user) => {
        const newReportId = utils.GenerateGuid();
        const newReportData = {
            _id: newReportId,
            createdBy: user?.id,
            creationDate: utils.GetCurrentUnixTime(),
            lastModifiedBy: user?.id,
            lastModifiedDate: utils.GetCurrentUnixTime()
        };

        Object.assign(newReportData, options);
        const db = Mongo.Connection.db();
        const reportsCollection = db.collection(REPORTS_COLLECTION);
        await reportsCollection.insertOne(newReportData);
        return newReportId;
    };

    const updateEntityReport = async (options, user) => {
        const reportId = options.id;
        delete options.id;
        options.lastModifiedBy = user?.id;
        options.lastModifiedDate = utils.GetCurrentUnixTime();
        const db = Mongo.Connection.db();
        const reportsCollection = db.collection(REPORTS_COLLECTION);
        await reportsCollection.updateOne({_id: reportId}, {$set: options});
        return reportId;
    };

    const saveReport = async (options, user) => {
        if (options.hasOwnProperty("id")) {
            return await updateEntityReport(options, user);
        } else {
            return await createNewEntityReport(options, user);
        }
    };

    const createNewWizard = async (user) => {
        const newWizardId = utils.GenerateGuid();
        const newWizard = {
            _id: newWizardId,
            title: "Wizard - " + newWizardId,
            createdBy: user?.id,
            creationDate: utils.GetCurrentUnixTime(),
            lastModifiedBy: user?.id,
            lastModifiedDate: utils.GetCurrentUnixTime(),
            wizardCode: ""
        };

        const db = Mongo.Connection.db();
        const wizardsCollection = db.collection(WIZARDS_COLLECTION);
        await wizardsCollection.insertOne(newWizard);
        return newWizardId;
    };

    const getWizard = async (id) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(WIZARDS_COLLECTION);
        return utils.normalizeMongoId(await collection.findOne({_id: id}));
    };

    const updateWizard = async (id, data, user) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(WIZARDS_COLLECTION);
        delete data._id;
        data.lastModifiedBy = user?.id;
        data.lastModifiedDate = utils.GetCurrentUnixTime();
        await collection.updateOne({_id: id}, {$set: data});
        return await getWizard(id);
    };

    const getWizards = async () => {
        const db = Mongo.Connection.db();
        const collection = db.collection(WIZARDS_COLLECTION);
        const wizards = await collection.find({}).toArray();
        return await Promise.all(wizards.map(utils.normalizeMongoId).map(async wizardData => {
            if (wizardData.createdBy) {
                wizardData.createdByUser = await getUserInfoCached(wizardData.createdBy);
            }
            if (wizardData.lastModifiedBy) {
                wizardData.lastModifiedByUser = await getUserInfoCached(wizardData.lastModifiedBy);
            }
            return wizardData;
        }));
    };

    const deleteWizard = async (id, user) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(WIZARDS_COLLECTION);
        await collection.deleteOne({_id: id});
        return true;
    };

    return Object.freeze({
        createNewForm,
        getForm,
        getFormFills,
        getFormsList,
        getReportFieldsList,
        checkUniqueKey,
        deleteForm,
        updateForm,
        addFormField,
        updateFormField,
        deleteFormField,
        fillForm,
        getReportDataView,
        saveReport,
        getReports,
        getReport,
        deleteReport,
        createNewWizard,
        getWizard,
        updateWizard,
        getWizards,
        deleteWizard
    });

}

Object.assign(module.exports, {
    makeDal
})