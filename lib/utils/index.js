/**
* Expose middleware
*/
var crypto = require('crypto');
var utils = exports = module.exports = {

    getUserDatabase: function (usr_d) {
        // if req' method is post,  database is from user 
        // or database is from cert
        return [usr_d.pfix,
				'_',
				usr_d.nfix
				].join('');
    },

    md5: function (value) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(value);
        return md5sum.digest('hex').toUpperCase();
    }
};

