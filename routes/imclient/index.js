

/*	Module dependencies.	*/

var utils = require('../../lib/utils')
  , schemas = require('../../lib/schema')
  , mongodb = require('../../lib/database')


/*	Expose imc.	*/
var imb = exports = module.exports = {

    /*	general setting of response header
    set access-control-allow-origin '*' */
    responseHeader: function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Content-Type', 'application/json');
        next();
    },

    /*	:type  , the type of document
    *	:where  , the find condition
    *	:select , the find selection */
    obtain: function (req, res) {

        var 
            q = req.body,
            where = q.where || {},
            select = q.select || {},



            db = mongodb.use(req.dbString),
            $documents = db.model(q.type, schemas.document);

        $documents.find(where, select, function (err, docs) {
            if (err)
                res.send(500, 'data access dennied');
            res.send(200, docs);
            db.close();
        })

    },







    /*	Middlewares	*/
    certVerify: function (req, res, next) {

        var q = req.body;
        if (q.cert && q.proj)
            next();
        else
            next(new Error('user cert or proj verify failed'));
    }

}