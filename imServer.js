
/**
* Module dependencies.
*/

var express = require('express')
  , http = require('http')
  , RedisStore = require('connect-redis')(express)
  , routes = require('./routes')

  , db = require('./lib/db');

/**
* Application Start
*/
var app = express();
app.listen(3000, 'localhost');
console.log('ImServer is running at localhost:3000');


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.favicon());

    //app.use(express.logger('dev'));

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: '_meta_imserver_',
        store: new RedisStore
    }));
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

app.get('/', routes.ima.index);

app.all('/login', routes.ima.login);
//app.post('/login', routes.ima.login);

app.all('/user', routes.ima.userIndex);













/*
* 	user authorize
*/
app.post('/authorize', authorize, userAuthorizedCallback);

/*
* :class  , the category of document
* :where  , the find condition
* :select , the find selection
*/
app.post('/obtain', userObtainCallback)


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

    var user = 'xymbtc_database',
        collname = 'DefaultProject',
        q = req.body,
        where = q.where || {},
        select = q.select || {};

    db(user)
        .collection(collname).find(where, select, function (err, docs) {
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
    if (!req.body) return next(new Error('params posted error.'));
    // authorizing

    db()
        .collection('users').find({ username: req.body.username }, function (err, docs) {
            if (err) return next(new Error('error occured.'));
            if (!docs || docs.length == 0) return next(new Error('user not found.'));
            if (docs[0].password != req.body.password) return next(new Error('password not matched.'));
            // authorized
            next();
        });
};
