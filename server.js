"use strict";

var express = require('express');
var path = require('path');
var routes = require(path.join(__dirname,'routes.js'));

var app = express();

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   app.locals.pretty = true;
}

app.use(express.static(path.join(__dirname,'/views')));

routes(app);

var port = process.env.PORT || 8080;

app.listen(port,  function () {
	 console.log('Node.js listening on port ' + port + '...');
});
