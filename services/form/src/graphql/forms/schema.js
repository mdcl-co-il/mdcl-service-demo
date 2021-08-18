const {gql} = require("apollo-server-express");

const Schema = gql`
    input FieldInput {
        type: Int
        name: String
        required: Boolean
        isKey: Boolean
        maxLength: Int
        group: Int
        extraData: String
    }

    input FormInput {
        title: String
        description: String
        fields: [FieldInput]
    }

    input FieldFillInput {
        fieldId: String
        field: String
        value: String
    }

    type FieldType {
        id: Int
        name: String
    }

    type Field {
        id: String
        type: Int
        name: String
        required: Boolean
        isKey: Boolean
        maxLength: Int
        group: Int
        extraData: String
    }

    type ReportField {
        id: String
        linkFieldId: String
        name: String
    }

    type User {
        name: String
        lastName: String
        email: String
        authLevel: Int
        username: String
    }

    type Form {
        id: String
        title: String
        description: String
        lastModifiedDate: Int
        createdByUser: User
        lastModifiedByUser: User
        fillCount: Int
        fields: [Field]
    }

    type FormFillField {
        fieldId: String
        field: String
        value: String
    }

    type FormFill {
        id: String
        user: User
        date: Int
        data: String
        dataMap: [FormFillField]
    }

    extend type Query {
        getFieldTypes: [FieldType]
        getForms: [Form]
        getForm(id: String): Form
        getFormFills(id: String): [FormFill]
        getReportFieldsList(id: String): [ReportField]
        checkUniqueKey(fieldId: String, value: String, ignoreFillId: String): Boolean
        getFillIdFromKey(formId: String, value: String): String
    }

    extend type Mutation {
        createForm(formData: FormInput): Form
        updateForm(formId: String, formData: FormInput): Form
        deleteForm(id: String): Boolean
        addFormField(formId: String): Field
        updateFormField(fieldId: String, data: FieldInput): Field
        deleteFormField(fieldId: String): Boolean
        fillForm(formId: String, data: [FieldFillInput]): Boolean
    }
`;

module.exports = Object.assign(module.exports, {
    Schema
});