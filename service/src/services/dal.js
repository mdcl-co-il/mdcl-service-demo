const makeNewDal = (Mongo, utils) => {

    const FORMS_COLLECTION = "SystemForms";
    const FORMS_FIELDS_COLLECTION = "SystemFormFields";
    const USERS_COLLECTION = "users";

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

        return await getForm(newFormId);
    };

    const getForm = async (formId) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        const formsFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
        const formData = utils.normalizeMongoId(await collection.findOne({_id: formId}));
        const formFields = await formsFieldsCollection.find({formId: formData.id}).toArray();
        formData.fields = formFields.map(utils.normalizeMongoId);
        const usersCollection = db.collection(USERS_COLLECTION);
        if (formData.createdBy) {
            formData.createdByUser = await usersCollection.findOne(Mongo.ObjectId(formData.createdBy));
        }
        if (formData.lastModifiedBy) {
            formData.lastModifiedByUser = await usersCollection.findOne(Mongo.ObjectId(formData.lastModifiedBy));
        }
        return formData;
    };

    const getFormsList = async () => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        const forms = await collection.find({}).toArray();
        return forms.map(utils.normalizeMongoId).map(async formData => {
            const formsFieldsCollection = db.collection(FORMS_FIELDS_COLLECTION);
            const formFields = await formsFieldsCollection.find({formId: formData.id}).toArray();
            formData.fields = formFields.map(utils.normalizeMongoId);
            const usersCollection = db.collection(USERS_COLLECTION);
            if (formData.createdBy) {
                formData.createdByUser = await usersCollection.findOne(Mongo.ObjectId(formData.createdBy));
            }
            if (formData.lastModifiedBy) {
                formData.lastModifiedByUser = await usersCollection.findOne(Mongo.ObjectId(formData.lastModifiedBy));
            }
            return formData;
        });
    };

    const deleteForm = async (formId, user) => {
        const db = Mongo.Connection.db();
        const collection = db.collection(FORMS_COLLECTION);
        return await collection.deleteOne({_id: formId});
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

    return Object.freeze({
        createNewForm,
        getForm,
        getFormsList,
        deleteForm,
        updateForm
    });

}

Object.assign(module.exports, {
    makeNewDal
})