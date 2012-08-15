

/**
* Module dependencies.
*/

var db = require('../../lib/db');


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
                        password = req.body.user.password;

            db()
                .collection('users').find({ username: name, password: password }, function (err, docs) {
                    if (!err) {
                        if (docs.length > 0) {
                            // authorize pass
                            req.session.user = { username: name };
                            res.redirect('/user');
                        }
                        else
                            res.send(500, 'user dennied');
                    }
                })
        };

    },

    userIndex: function (req, res) {
        res.render('imadmin/home', { title: 'Welcome', user: req.session.user });
    }
}