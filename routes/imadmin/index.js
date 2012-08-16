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
            });

        };

    },

    userIndex: function (req, res) {
        switch (req.method) {
            case 'GET':
                res.render('imadmin/home', { title: 'Welcome', user: req.session.user });
                break;

            case 'POST':
                var title = req.body.doc.title,
        			category = req.body.doc.collection,
        			content = req.body.doc.content,
                // we need a function to generate database
        			dbname = utils.getUserDatabase({
        			    pfix: 'xymbtc',
        			    nfix: 'database'
        			}),

        			db = mongodb.use(dbname),
                    $documents = db.model('document', schemas.document),
                    newDoc = new $documents({
                        title: title,
                        category: category,
                        content: content
                    });

                newDoc.save(function (err, docs) {
                    if (!err) {
                        res.redirect('/user')
                    }
                    else
                        res.send(500, 'save dennied');

                })
                break;
        }
    },


    /**
    * middleware : user authorize
    */
    userAuthorize: function (req, res, next) {

        if (req.session.user && req.session.user.name)
            next();
        else
            next(new Error('user authorize failed'));
    }
}