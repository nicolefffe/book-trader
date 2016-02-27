var fs = require("fs");
var path = require("path");
var jade = require('jade');
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
      res.json(req.user);
  });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

  app.route('/books/').
    get(function(req,res) {

      var kind = req.query.type;

      if (kind === 'search') {
        var search = req.query.q;

        search = search.replace(/ /g,'+');
        search = search.match(/[\w\+]/g);
        search = search.join('');
        search = search.replace(/\+$/,'');

        findBook.getTitle(search,function(results) {
          res.json(results);
        });
      }

      else if (kind === 'lib') {
        var library = req.query.q;

        library = library.match(/[\w,]/g);
        library = library.join('');
        library = library.split(',')
        console.log(library);

        findBook.getLibrary(library,function(results) {
          res.json(results);
        });
      }

  });

  app.route('/update/').
    post(isLoggedIn, function(req,res) {

      var user = req.user.github.username;
      var book = req.query.book || null;
      var address = req.query.addr || null;
      var trade = req.query.trade || null;
      var newBook = req.query.new || null;

      if (address) {
        var obj = {
          'street': req.query.street || '',
          'city': req.query.city || '',
          'state': req.query.state || '',
          'postal': req.query.postal || '',
          'country': req.query.country || ''
        };

        users.setAddress(user,obj,function(results) {
          res.json(results);
        });
      }

      else if (book) {
        if (newBook) {
          users.addBook(user,req.query.bookID,function(results) {
            res.json(results);
          });
        }
        else if (trade !== null) {
          users.tradeable(user,req.query.bookID,trade,function(results) {
            res.json(results);
          });
        }
      }
  });

};
