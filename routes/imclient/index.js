

/*	Module dependencies.	*/

var db = require('../../lib/db'),
	utils = require('../../lib/utils');


/*	Expose imc.	*/
var imb = exports = module.exports = {

	/*	general setting of response header
		set access-control-allow-origin '*' */
	responseHeader: function(req, res, next){
		res.header('Access-Control-Allow-Origin', '*');
    	res.set('Content-Type', 'application/json');
    	next();
	},

	/*	:type  , the type of document
	*	:where  , the find condition
	*	:select , the find selection */
	obtain: function(req, res){

	    var q = req.body,
    		database = utils.getUserDatabase({pfix: q.cert, nfix: q.proj}),
			collname = q.type
  	    	where = q.where || {},
    	    select = q.select || {};
		
    	db(database)
        	.collection(collname).find(where, select, function (err, docs) {
            	if (err) return next(new Error('error occured'));
            	res.send(200, docs);
        	});
	},
	
	
	
	
	
	
	
	/*	Middlewares	*/
	certVerify: function(req, res, next){
		var q = req.body;
		if(q.cert && q.proj)
			next();
		else
			next(new Error('user cert or proj verify failed'));
	}
	
}