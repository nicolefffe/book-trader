var fs = require("fs");
var path = require("path");
var jade = require('jade');

module.exports = function(app) {

  app.set('views',path.join(__dirname,'../..','views/'));

  app.locals.basedir = path.join(process.env.PWD,'views');

  app.set('view engine', 'jade');

  app.get('/', function(request, response) {
    response.render('pages/index');
  });

};
