var fs = require("fs");
var path = require("path");
var jade = require('jade');
var bodyParser = require('body-parser');

var FindBook = require(path.join(__dirname,'controllers','server-books.js'))
var Users = require(path.join(__dirname,'controllers','server-people.js'))

module.exports = function(app,passport) {

  var findBook = new FindBook();
  var users = new Users();

  var isLoggedIn = function(req,res,next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  };

  app.locals.pretty = true;
  app.locals.basedir = path.join(process.env.PWD,'front_end');
  app.use(bodyParser.json());

  app.set('views','./front_end');
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
      res.render(path.join('app/components/profile','profile'));
    });

  app.route('/api/:id')
    .get(isLoggedIn, function(req,res) {
      res.json(req.user);
  });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

  app.route('/books/search').
    get(function(req,res) {

      var search = req.query.q;

      search = search.replace(/ /g,'+');
      search = search.match(/[\w\+]/g);
      search = search.join('');
      search = search.replace(/\+$/,'');

      findBook.getTitle(search,function(results) {
        res.json(results);
      });
  });

  app.route('/books/browse').
    get(isLoggedIn, function(req,res) {

      var user = req.user.github.username;
      users.allBooks(user,function(results) {
        res.json({books: results});
      });
  });

  app.route('/address').
    post(isLoggedIn, function(req,res) {

      var user = req.user.github.username;
      var address = req.body;

      users.setAddress(user,address,function(results) {
        res.json(results);
      });
  });

  app.route('/book/new').
    post(isLoggedIn, function(req,res) {

      var user = req.user.github.username;
      var book = req.body;

      users.addBook(user,book,function(results) {
        res.json({'books': results});
      });
  });

  app.route('/book/update').
    post(isLoggedIn, function(req,res) {

      var user = req.user.github.username;
      var trade = req.query.trade || null;
      var remove = req.query.del || null;

      if (remove) {
        users.removeBook(user,req.query.bookID,function(results) {
          res.json(results);
        });
      }
      else if (trade) {
        users.tradeable(user,req.query.bookID,function(results) {
          res.json(results);
        });
      }
  });

};
