const makeUserModel = (userModel, mongooseSchema, mongooseModel, passportLocalMongoose) => {
    let userSchema = new mongooseSchema(userModel);
    userSchema.plugin(passportLocalMongoose);
    let User = mongooseModel('User', userSchema);

    return Object.freeze({
        User
    });
};


Object.assign(module.exports, {
    makeUserModel
})
