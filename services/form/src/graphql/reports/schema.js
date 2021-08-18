const {gql} = require("apollo-server-express");

const Schema = gql`

    scalar ReportRowValue

    scalar FindObject

    type Report {
        columns: [String]
        rows: [ReportRowValue]
    }

    type ReportFieldDef {
        id: String
        linkFieldId: String
        name: String
    }
    
    type inputVariables {
        name: String
        type: String
        defaultValue: String
    }

    type ReportDef {
        id: String
        title: String
        description: String
        lastModifiedDate: Int
        createdByUser: User
        lastModifiedByUser: User
        baseForm: String
        allFields: [ReportFieldDef]
        visibleFields: [ReportFieldDef]
        inputVariables: [inputVariables],
        inputVariablesText: String
        findObject: FindObject
    }

    extend type Query {
        runReport(payload: String): Report
        getReports: [ReportDef]
        getReport(id: String): ReportDef
    }

    extend type Mutation {
        saveReport(payload: String): String
        deleteReport(id: String): Boolean
    }
`;

module.exports = Object.assign(module.exports, {
    Schema
});