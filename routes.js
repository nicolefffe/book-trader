var fs = require("fs");
var path = require("path");
var jade = require('jade');
var FindBook = require(path.join(__dirname,'controllers','server-books.js'))

module.exports = function(app,key) {

  var findBook = new FindBook();

  app.set('views',path.join(__dirname,'views'));

  app.locals.basedir = path.join(process.env.PWD,'views');

  app.set('view engine', 'jade');

  app.get('/', function(request, response) {
    response.render('index');
  });

  app.route('/find/').
    get(function(req,res) {
      var search = req.query.q;
      console.log(search);
      var kind = req.query.type;

      search = search.replace(/ /g,'+');
      search = search.match(/[\w\+]/g);
      search = search.join('');
      search = search.replace(/\+$/,'');

      findBook.getTitle(search,function(results) {
        console.log(results);
        res.end(JSON.stringify(results));
      });
  });

};
