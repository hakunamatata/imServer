

/**
* Module dependencies.
*/

var db = require('../../lib/db'),
	utils = require('../../lib/utils');


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
                .collection('users').find({ 
                	username: name, 
                	password: password 
                }, function (err, docs) {
                    if (!err) {
                        if (docs.length > 0) {
                            // authorize pass
                            req.session.user = { name: name };
                            res.redirect('/user');
                        }
                        else
                            res.send(500, 'user dennied');
                    }
                })
        };

    },
	
    userIndex: function (req, res) {
    	switch(req.method){
    		case 'GET':
    			res.render('imadmin/home', { title: 'Welcome', user: req.session.user });
    			break;
    		
    		case 'POST':
    			var title = req.body.doc.title,
        			collection = req.body.doc.collection,
        			content = req.body.doc.content,
        			// we need a function to generate database
        			database = utils.getUserDatabase({
        				pfix: 'xymbtc',
        				nfix: 'database'
        			});
        		
        		db(database)
        			.collection('documents').insert({
        				doc_title: title,
        				doc_collection: collection,
        				doc_content: content
        			}, function(err){
        				if(!err)
        					res.redirect('/user')
        				else
        					res.send(500, 'save failed');
        			});
    				break;
    	}
    },
    
    
    /**
    * middleware : user authorize
    */
	userAuthorize:function(req, res, next){
		if(req.session.user && req.session.user.name)
			next();
		else
			next(new Error('user authorize failed'));
	}
}