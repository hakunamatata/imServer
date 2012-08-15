
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



/**
* the im Server Page Route
*/

app.get('/', routes.ima.index);

app.all('/login', routes.ima.login);

app.all('/user',routes.ima.userAuthorize, routes.ima.userIndex);






/**
* the im Client Request Route
*/

app.post('/obtain', routes.imc.certVerify, routes.imc.responseHeader, routes.imc.obtain);



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
