/**
* Module dependencies.
*/
var config = require('../config'),
    mongodb = require('../database'),
    mongoose = mongodb.mongoose;


/*  Expose    */

var schema = exports = module.exports = {
    document: new mongoose.Schema({
        title: String,
        category: String,
        content: String
    }),

    category: new mongoose.Schema({
        parent: String,
        name: String
    }),

    users: new mongoose.Schema({
        username: String,
        password: String
    })
}
