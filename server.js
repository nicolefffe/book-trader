"use strict";

var express = require('express');
var path = require('path');
var routes = require(path.join(__dirname,'routes.js'));
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();

require('dotenv').load();
require('./config/passport')(passport);

app.use(session({
    secret: 'b00ktrade',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var mongo = process.env.MONGO_URI || undefined;
mongoose.connect(mongo);

app.use(express.static(path.join(__dirname,'/front_end')));

routes(app,passport);

var port = process.env.PORT || 8080;

app.listen(port,  function () {
	 console.log('Node.js listening on port ' + port + '...');
});
