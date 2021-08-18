const makeTokenModel = (tokenModel, mongooseSchema, mongooseModel) => {
    let tokenSchema = new mongooseSchema(tokenModel);
    let Token = mongooseModel('Token', tokenSchema);

    return Object.freeze({
        Token
    });
};


Object.assign(module.exports, {
    makeTokenModel
})
