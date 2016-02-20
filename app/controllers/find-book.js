'use strict';
var https = require('https');
require('dotenv').load();

function findBook() {
  var booksKey = process.env.BOOKS_KEY || undefined;
  var googleBooks = 'www.googleapis.com';
  var path = '/books/v1/volumes?q=';

  this.getTitle = function(search,callback) {
    var titlePath = path + '+intitle:' + search + '&printType=books&maxResults=10&key=' + booksKey;

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
          callback(reply);
        });
    });

    req.on('error',function(err) {
      console.log(err);
    });
    req.end();
  }
};

module.exports = findBook;
