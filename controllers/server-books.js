'use strict';
var https = require('https');
require('dotenv').load();

function findBook() {
  var booksKey = process.env.BOOKS_KEY || undefined;
  var googleBooks = 'www.googleapis.com';
  var path = '/books/v1/volumes';

  this.getTitle = function(search,callback) {
    var titlePath = path + '?q=+intitle:' + search + '&printType=books&maxResults=10&key=' + booksKey;

    console.log(googleBooks + titlePath);

    var req = https.request({
      hostname: googleBooks,
      path: titlePath,
      method: 'GET'
    },function(results) {
        var reply = '';

        results.on('data',function(chunk) {
          reply += chunk;
        });

        results.on('end',function() {

          var books = [];
          var obj = JSON.parse(reply);
          console.log(JSON.stringify(obj.items));

          if (obj.items.length > 0) {
            obj.items.forEach(function(element) {

              var d = element.volumeInfo.description || ' ';
                if (d.length > 200) {
                d = d.slice(0,190) + '...';
              }

              var img = true;
              var blank = false;
              if (!element.volumeInfo.imageLinks) {
                img = false;
                blank = true;
              }

              books.push({
                "id": element.id,
                "title": element.volumeInfo.title || 'n/a',
                "author": (element.volumeInfo.authors) ? element.volumeInfo.authors.join(', ') : 'n/a',
                "publisher": element.volumeInfo.publisher || 'n/a',
                "date": element.volumeInfo.publishedDate || 'n/a',
                "description": d,
                "isIMG": img,
                "isBlank": blank,
                "img": (element.volumeInfo.imageLinks) ? element.volumeInfo.imageLinks.thumbnail : undefined,
                "lang": element.volumeInfo.language || 'n/a'
              });
            });
          }

          callback({books: books});
        });
    });

    req.on('error',function(err) {
      console.log(err);
    });
    req.end();
  };

  this.getID = function(id,callback) {
    var idPath = path + '/' + id + '&key=' + booksKey;

    var req = https.request({
      hostname: googleBooks,
      path: idPath,
      method: 'GET'
    },function(results) {
        var reply = '';

        results.on('data',function(chunk) {
          reply += chunk;
        });

        results.on('end',function() {
          callback(reply);
        });
    });

    req.on('error',function(err) {
      console.log(err);
    });
    req.end();
  };
};

module.exports = findBook;
