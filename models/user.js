const { type } = require("express/lib/response");
const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{//in this no need to make field of username and password
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);//it already implement the username and password which are hashed and salted// "plugin" refers to an external, self-contained module or piece of code designed to extend or modify the functionality of a core application without altering its main codebase

module.exports = mongoose.model('User', userSchema);
