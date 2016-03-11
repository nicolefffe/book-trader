'use strict';
var https = require('https');
require('dotenv').load();

module.exports = function() {

  var booksKey = process.env.BOOKS_KEY || undefined;
  var googleBooks = 'www.googleapis.com';
  var path = '/books/v1/volumes';

  var formatBook = function(book) {
    var d = book.volumeInfo.description || ' ';
    if (d.length > 150) {
        d = d.slice(0,145) + '...';
    }
    d = d.replace(/<[bpri\/]*>/g,'');

    var img = true;
    var blank = false;
    if (!book.volumeInfo.imageLinks) {
      img = false;
      blank = true;
    }

    var formatted = {
      "id": book.id,
      "google": {
        "title": book.volumeInfo.title || 'n/a',
        "author": (book.volumeInfo.authors) ? book.volumeInfo.authors.join(', ') : 'n/a',
        "publisher": book.volumeInfo.publisher || 'n/a',
        "date": book.volumeInfo.publishedDate || 'n/a',
        "description": d,
        "isIMG": img,
        "isBlank": blank,
        "img": (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : undefined
      }
    };

    return formatted;
  };

  this.getTitle = function(search,callback) {

    var titlePath = path + '?q=+intitle:' + search + '&printType=books&maxResults=10&key=' + booksKey;

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
          console.log(obj);

          if (obj.totalItems === 0) {
            books.push({
              "id": null,
              "error": 'No matches found'
            });
            callback({books: books});
          }

          else {
            obj.items.forEach(function(element) {
              books.push(formatBook(element));
            });
            callback({books: books});
          }
        });
    });

    req.on('error',function(err) {
      console.log(err);
    });
    req.end();
  };

};
