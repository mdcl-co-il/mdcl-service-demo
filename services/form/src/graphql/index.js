const {ApolloServer} = require("apollo-server-express");
const formGraphModule = require('./forms');
const reportGraphModule = require('./reports');
const wizardsGraphModule = require('./wizards');
const {gql} = require("apollo-server-express");
const {AuthenticationError} = require("apollo-server-errors");
const {ConfigLoader} = require('@mdcl-co-il/config-loader');

const serviceConfig = ConfigLoader.getServiceConfig("form");
let exposePlayground = false;
if (serviceConfig.hasOwnProperty("exposePlayground") && serviceConfig.exposePlayground) {
    exposePlayground = true;
}


const typeDefs = gql`
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    ${formGraphModule.Schema}
    ${reportGraphModule.Schema}
    ${wizardsGraphModule.Schema}
`;

const resolvers = [formGraphModule.Resolver, reportGraphModule.Resolver, wizardsGraphModule.Resolver];

const makeServer = () => {
    return new ApolloServer({
        typeDefs,
        resolvers,
        playground: exposePlayground,
        context: ({req}) => {
            const user = req.user;
            if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {

            } else {
                if (!user)
                    throw new AuthenticationError('you must be logged in');
            }
            return {user};
        },
    });
};

module.exports = Object.assign(module.exports, {
    graphQlServer: makeServer()
});