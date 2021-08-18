const {gql} = require("apollo-server-express");

const Schema = gql`
    scalar RunResponse
    
    type Wizard {
        id: String
        title: String
        creationDate: Int
        createdBy: User
        lastModifiedDate: Int
        wizardCode: String
    }

    extend type Query {
        runWizard(id: String): RunResponse
        getWizard(id: String): Wizard
        getWizards: [Wizard]
    }

    extend type Mutation {
        createNewWizard: String
        updateWizard(id: String, data: String): Wizard
        deleteWizard(id: String): Boolean
    }
`;

module.exports = Object.assign(module.exports, {
    Schema
});