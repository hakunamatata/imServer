
/**
* Module dependencies.
*/

var express = require('express')
  , http = require('http')
  , RedisStore = require('connect-redis')(express)
  , routes = require('./routes');
require('date-utils');


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
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});




/**
*   中间件
*/

var userAuthAndDataBase = [
          routes.ima.userAuthorize  // 用户验证
        , routes.ima.useDataBase // 用户数据库选择
    ],

    generateUserAndDoc = [
    	routes.ima.userAuthorize  // 用户验证
      , routes.ima.useDataBase // 用户数据库选择
      , routes.ima.generateUser
      , routes.ima.generateDoc
    ]

/*
* 	ROUTERS
*/

/**
* the im Server Page Route
*/



app.get('/', routes.ima.userAuthorize, routes.ima.index);

app.get('/login', routes.ima.login);

app.post('/login', routes.ima.userExist, routes.ima.login);

app.post('/register', routes.ima.userExist, routes.ima.register);

app.get('/user', routes.ima.userAuthorize, routes.ima.userIndex);

app.get('/logout', function (req, res) { delete req.session.destroy(); res.redirect('/login') });
app.get('/exit', function (req, res) { delete req.session.destroy(); res.redirect('/') });

/**
* 用户提交操作
*/
app.post('/user/addoc', userAuthAndDataBase, routes.ima.postDoc);
app.post('/user/addProject', userAuthAndDataBase, routes.ima.postProject);
app.post('/user/projectDefault', userAuthAndDataBase, routes.ima.projectDefault, routes.ima.projectDefaultSave);
app.get('/user/getdocuments', userAuthAndDataBase, routes.ima.getDoc);

app.get('/jade/imadmin/:jname.jade', generateUserAndDoc, routes.ima.postTemple);

app.get('/ueditor/', function (req, res) {
    res.render('index.jade');
});

/**
* the im Client Request Route
*/

app.post('/obtain', routes.imc.certVerify, routes.ima.useDataBase, routes.imc.responseHeader, routes.imc.obtain);

