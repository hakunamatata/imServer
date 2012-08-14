
/**
* Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongojs = require('mongojs')
  , cnnOption = {
      host: 'localhost',
      port: 27017,
      username: '',
      password: '',
      db: 'IMJS'
  };


var app = express();
app.listen(3000, 'localhost');
console.log('ImServer is running at localhost:3000');


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(clientErrorHandler);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler());

});



/*
 *
 * 	ROUTERS
 *
 */


/*
 * 	user authorize
 */
app.post('/authorize', authorize, userAuthorizedCallback);

/*
* :class  , the category of document
* :where  , the find condition
* :select , the find selection
*/
app.post('/obtain', obtainPrepareDb, userObtainCallback)


/*
 *
 * 	ROUTERS Callback
 *
 */
 
function userAuthorizedCallback(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    res.send(200, { text: 'access acquired' });
}

function userObtainCallback(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    var db = req.db,
        collname = 'DefaultProject',
        q = req.body,
        where = q.where || {},
        select = q.select || {};

    db.collection(collname).find(where, select, function (err, docs) {
        if (err) return next(new Error('error occured'));
        res.send(200, docs);
    });

}



/*
 *
 * 	MIDDLEWARES
 *
/*


/*
 *	clientError handle
 */ 
function clientErrorHandler(err, req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    if (req.xhr)
        res.send(500, err);
    else
        next(err);
}

/*
 *  user authorize middleware
 */
function authorize(req, res, next) {
	if(!req.body) return next(new Error('params posted error.'));
    // authorizing
    var db = mongojs.connect(cnnOption);
    db.collection('users').find({ username: req.body.username }, function (err, docs) {
        if (err) return next(new Error('error occured.'));
        if (!docs || docs.length == 0) return next(new Error('user not found.'));
        if (docs[0].password != req.body.password) return next(new Error('password not matched.'));
        next();
    });
};

function obtainPrepareDb(req, res, next) {
    if (!req.body) return next(new Error('params posted error'));
    if (!req.body.class) req.body.class = 'collection'
    var user = 'xymbtc' + '_database',
        conn = {
            host: cnnOption.host,
            port: cnnOption.port,
            username: cnnOption.username,
            password: cnnOption.password,
            db: user
        },
        db = mongojs.connect(conn);
    req.db = db;
    next();
}
