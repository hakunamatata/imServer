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
        tags:[{text:String}],
        category: [this.category],
        content: String,
        publishDate: {type: Date, default: Date.now},
        hits: Number,
        preDoc: [this.document],
        nextDoc: [this.document],
        source: String,
        author: String,
        publisher: String
    }),

    category: new mongoose.Schema({
        parent: String,
        name: String
    }),

    user: new mongoose.Schema({
        username: String,
        password: String,
        userCert: String,
        project: [{projName: String, projCert: String,	projCreateDate: Date,   projDefault: Boolean }],
        regDate: Date,
        lastLogDate: Date
    })
}
