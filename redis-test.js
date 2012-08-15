
/**
* Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongojs = require('mongojs')
  , RedisStore = require('connect-redis')(express)
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
    app.use(express.cookieParser());
    app.use(express.session({
        secret: '_meta_imserver_',
        store: new RedisStore
    }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler());

});


app.configure('development', function () {
    app.use(express.errorHandler());

});


app.get('/', function (req, res) {
    console.log(req.sessionID);
    req.session.user = { name: 'ajfasfjasldj;' };
    res.send(200, 'Hi...');


});
