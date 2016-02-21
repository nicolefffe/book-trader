"use strict";

var express = require('express');
var path = require('path');
var routes = require(path.join(__dirname,'routes.js'));

var app = express();

app.use(express.static(path.join(__dirname,'/public')));

routes(app);

var port = process.env.PORT || 8080;

app.listen(port,  function () {
	 console.log('Node.js listening on port ' + port + '...');
});
