/**
* Module dependencies.
*/

var config = require('./config')
  , mongoose = require('mongoose');


/* Expose   */

var mongodb = exports = module.exports = {

    mongoose: mongoose,

    use: function (dbname) {
        return mongoose.createConnection(config.connectionObject.host, dbname || config.connectionObject.db);
    }
}