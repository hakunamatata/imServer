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
        content: String,
        publishDate: {type: Date, default: Date.now},
        hits: Number,
        preDoc: [this.document],
        nextDoc: [this.document],
        tags:[{text: String}],
        source: String,
        author: String
    }),

    category: new mongoose.Schema({
        parent: String,
        name: String
    }),

    users: new mongoose.Schema({
        username: String,
        password: String,
        userCert: String,
        projet: [{projName: String, projCert:String, projCreateDate: Date, projDefault: Boolean }],
        regDate: Date,
        lastLogDate: Date
    })
}
