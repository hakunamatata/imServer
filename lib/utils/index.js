
/**
* Modules Depence
*/
var crypto = require('crypto'),
    mongodb = require('../database'),
    _ = require('../../lib/underscore');

/**
* Expose middleware
*/

var utils = exports = module.exports = {

    md5: function (value) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(value);
        return md5sum.digest('hex').toUpperCase();
    }
};

