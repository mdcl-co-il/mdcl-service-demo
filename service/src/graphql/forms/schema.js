const {gql} = require("apollo-server-express");

const Schema = gql`
    input FieldInput {
        type: Int
        name: String
        required: Boolean
        maxLength: Int
        group: Int
    }

    input FormInput {
        title: String
        description: String
        fields: [FieldInput]
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
        maxLength: Int
        group: Int
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
        fields: [Field]
    }

    type Query {
        getFieldTypes: [FieldType]
        getForms: [Form]
        getForm(id: String): Form
    }

    type Mutation {
        createForm(formData: FormInput): Form
        updateForm(formId: String, formData: FormInput): Form
        deleteForm(id: String): Boolean
    }
`;

module.exports = Object.assign(module.exports, {
    Schema
});