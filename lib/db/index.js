

/**
* Module dependencies.
*/

var mongojs = require('mongojs');



/**
* Expose 'createDataBase'.
*/
exports = module.exports = createDataBase;



/**
* Create an mongo database.
*
* @return {Function}
* @api public
* @param name {String}
*
*           db name, 'IMJS' default
*/
function createDataBase(name) {
    
    var cnn = {
        host: 'localhost',
        port: 27017,
        username: '',
        password: '',
        db: name || 'IMJS'
    };

    return mongojs.connect(cnn);
}



