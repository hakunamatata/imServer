/**
* Module dependencies.
*/

var utils = require('../../lib/utils')
  , schemas = require('../../lib/schema')
  , mongodb = require('../../lib/database');



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

            if (req.userExist) {
                $users.find({ username: name, password: password }, function (err, users) {
                    db.close();
                    if (!err) {
                        if (users.length > 0) {
                            req.session.user = { name: name, usercert:users[0].usercert };
                            res.redirect('/user');
                        } else {
                            res.send('password not matched! ');
                        }
                    } else {
                        res.send('error occured');
                    }

                });
            } else {
                db.close();
                res.send('user is not exist');
            }
        };

    },

    register: function (req, res) {
        if (req.method === 'GET') {
            res.render('imadmin/login', { title: 'login' });
        } else {
            var name = req.body.user.name,
            	password = req.body.user.password,
            	db = mongodb.use(),
        		$users = db.model('users', schemas.users);

            if (!req.userExist) {
                var user = new $users({
                    username: name,
                    password: password,
                    userCert: utils.md5(name),
                    project: [],
                    regDate: Date.now(),
                    lastLogDate: Date.now()
                });
                user.save();
                db.close();
                res.redirect('/user');
            } else {
                db.close();
                res.send('用户已存在');
            }
        }
    },
    /**
    *	用户发布文章	
    */
    postDoc: function(req, res){
    	var q = req.body,
    		ur = req.session.user,
    		projcert = 'PROJCERT',
    		db = mongodb.use(utils.getUserDatabase({
    			pfix: ur.usercert,
    			nfix: projcert
    		})),
    		$document = db.model('document', schemas.document);
    		
    		doc = new $document({
    			title: q.title,
    			category: q.category,
    			content: q.content,
    			publishDate: Date.now(),
    			hits: 0		
    		});
    		
    		doc.save(function(err){
    			if (!err){
    				res.send({
    					value: true,
    					text: '保存成功。'
    				});
    				db.close();
    			} else {
    				res.send({
    					value: false,
    					text: '保存失败。'
    				});
    				db.close();
    			}
    		});
    },

    userIndex: function (req, res) {
        res.render('imadmin/home', { title: 'Welcome' });
    },


    /**
    * middleware : user authorize
    */
    userAuthorize: function (req, res, next) {
        if (req.session.user && req.session.user.name)
            next();
        else
            res.redirect('/login');
    },

    userExist: function (req, res, next) {
        var name = req.body.user.name
        db = mongodb.use(),
        	$users = db.model('users', schemas.users);

        $users.find({ username: name }, function (err, users) {
            db.close();
            if (!err) {
                if (users.length > 0)
                    req.userExist = true;
                else
                    req.userExist = false;
                next();
            } else {
                next(new Error('error occured'));
            }
        });
    }
}