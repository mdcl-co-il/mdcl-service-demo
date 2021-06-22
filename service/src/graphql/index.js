const {ApolloServer} = require("apollo-server-express");
const formGraphModule = require('./forms')
const {AuthenticationError} = require("apollo-server-errors");

const typeDefs = [formGraphModule.Schema];
const resolvers = [formGraphModule.Resolver];

const makeServer = (exposePlayground = false) => {
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

let graphQlServer;

const init = (serviceConfig) => {
    let exposePlayground = false;
    if (serviceConfig.hasOwnProperty("exposePlayground") && serviceConfig.exposePlayground) {
        exposePlayground = true;
    }
    graphQlServer = makeServer(exposePlayground);
};

module.exports = Object.assign(module.exports, {
    init,
    graphQlServer: () => {
        return graphQlServer;
    }
});