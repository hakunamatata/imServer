/**
* Module dependencies.
*/

var utils = require('../../lib/utils')
  , schemas = require('../../lib/schema')
  , mongodb = require('../../lib/database')



/**
* Expose ima.
*/

var ima = exports = module.exports = {

    /**
    * Redirect to Login page 
    */
    index: function (req, res) {
        res.redirect('/login');
    },

    /**
    * Login 
    */
    login: function (req, res) {

        if (req.method === 'GET') {
            // GET Request
            res.render('imadmin/login', { title: 'Login' });
        } else {
            // POST Request
            var name = req.body.user.name,
                password = req.body.user.password,

                db = mongodb.use(),
                $users = db.model('users', schemas.users);

            $users.find({ username: name, password: password }, function (err, users) {

                if (!err) {
                    if (users.length > 0) {
                        req.session.user = { name: name };
                        res.redirect('/user');
                    } else
                        res.send(500, 'user not found.');
                }
                else
                    res.send(500, 'user dennied');

                db.close();
            });

        };

    },

    userIndex: function (req, res) {
            res.send('Hello world.');
        }
    },


    /**
    * middleware : user authorize
    */
    userAuthorize: function (req, res, next) {

        if (req.session.user && req.session.user.name)
            next();
        else
            res.redirect('/login');
    }
}