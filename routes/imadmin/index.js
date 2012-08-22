/**
* Module dependencies.
*/

var utils = require('../../lib/utils')
  , schemas = require('../../lib/schema')
  , mongodb = require('../../lib/database')
  , _ = require('../../lib/underscore')
  , Defauts = {
      defaultProject: utils.md5('Default Project')  // 在用户未指定默认项目时，系统默认的默认项目
  }


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
      * 用户登录
      * @middleware  userExist 
      * @public
      * @function
      * @param {Object} obj
      * @returns       
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
        		$users = db.model('users', schemas.user);

              if (req.userExist) {
                  $users.find({ username: name, password: password }, function (err, users) {
                      db.close();
                      if (!err) {
                          if (users.length > 0) {
                              // 用户Session保存
                              req.session.user = users[0];
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

      /**
      * 用户注册
      * @middleware  userExist 
      * @public
      * @function
      * @param {Object} obj
      * @returns       
      */
      register: function (req, res) {
          if (req.method === 'GET') {
              res.render('imadmin/login', { title: 'login' });
          } else {
              var name = req.body.user.name,
            	password = req.body.user.password,
            	db = mongodb.use(),
        		$users = db.model('users', schemas.user);

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
      postDoc: function (req, res) {
          var q = req.body,
    		ur = req.session.user,
    		projcert = 'PROJCERT',
    		db = mongodb.use(req.dbString);

          $document = db.model('document', schemas.document),

            doc = new $document({
                title: q.title,
                category: q.category,
                content: q.content,
                publishDate: Date.now(),
                hits: 0
            }),

          // 返回值
            response = {
                err: false,
                responseText: '',
                callback: null
            };

          doc.save(function (err) {
              if (!err) {
                  response.responseText = '文档保存成功。';
              } else {
                  response.err = err;
                  response.responseText = err.err;
              }
              res.send(response);
              db.close();
          });
      },

      userIndex: function (req, res) {

          // 组织用户数据
          var response = {
              title: '设置',
              user: req.session.user
          };

          res.render('imadmin/home', response);
      },


      /**
      * middleware : user authorize
      */
      userAuthorize: function (req, res, next) {
          if (req.session.user && req.session.user.username)
              next();
          else
              res.redirect('/login');
      },

      userExist: function (req, res, next) {
          var name = req.body.user.name
          db = mongodb.use(),
        	$users = db.model('users', schemas.user);

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
      },

      useDataBase: function (req, res, next) {
          var ur = req.session.user,
            uq = req.body,
            dbString = null;
          if (ur) {

              var defaultProject = _.find(ur.project, function (obj) {
                  return obj.projDefault;
              });

              dbString = [
                            'USERDB_',
                            utils.md5([
                                        ur.userCert, '_',
                                        defaultProject ? defaultProject.projCert : Defauts.defaultProject
                                       ].join(''))
                        ].join('');

          } else if (uq) {

              dbString = [
                            'USERDB_',
                            utils.md5([
                                        ur.cert, '_',
                                        ur.proj
                                      ].join(''))
                        ].join('');

          }

          req.dbString = dbString;
          next();
      }
  }