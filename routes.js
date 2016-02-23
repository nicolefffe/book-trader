var fs = require("fs");
var path = require("path");
var jade = require('jade');
var FindBook = require(path.join(__dirname,'controllers','server-books.js'))

module.exports = function(app,passport) {

  var findBook = new FindBook();

  var isLoggedIn = function(req,res,next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  };

  app.locals.pretty = true;
  app.locals.basedir = path.join(process.env.PWD,'views');

  app.set('views',path.join(__dirname,'views'));
  app.set('view engine', 'jade');

  app.route('/')
    .get(isLoggedIn, function(req,res) {
      res.render('index');
    });

  app.route('/login')
    .get(function(req,res) {
      res.render('login');
    });

  app.route('/logout')
    .get(function(req,res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/profile')
    .get(isLoggedIn, function(req,res) {
      res.render('profile');
    });

  app.route('/api/:id')
    .get(isLoggedIn, function(req,res) {
      res.json(req.user.github);
  });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

  app.route('/api/books/').
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
