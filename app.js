
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');

var signin = require('./routes/signin');
var index = require('./routes/index');
var timeline = require('./routes/timeline');
var map = require('./routes/map');
var nav = require('./routes/navbar');
var contactinfo = require('./routes/contactinfo');
var details = require('./routes/details');
var searchlist = require('./routes/searchlist');
var searchhandler = require('./routes/searchevents');
var account = require('./routes/account');
var category = require('./routes/category');
var newpost = require('./routes/newpost');
var Firebase = require("firebase");
// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', signin.view);
app.get('/index', index.view);
app.get('/newpost', newpost.view);
app.get('/timeline', timeline.view);
app.get('/map', map.view);
app.get('/navbar', nav.view);
app.get('/contactinfo', contactinfo.view);
app.get('/details', details.view);
app.get('/searchlist', searchlist.view);
app.get('/category/professional', category.viewProfessional);
app.get('/category/social', category.viewSocial);
app.get('/category/performance', category.viewPerformance);
app.get('/category/political', category.viewPolitical);
app.get('/category/seminars', category.viewSeminars);
app.get('/category/althletics', category.viewAthletics);
app.post('/account/add-account', account.addAccount);
app.post('/account/login', account.findAccount);
app.post('/account/sign-up-name-check', account.nameCheck);
app.post('/search-events-by-keyworld', searchhandler.lookupEventsByKeyworld);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
