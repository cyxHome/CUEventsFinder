
/**
 * Module dependencies.
 */

var express = require('express');
var body_parser = require('body-parser')
var aws = require('aws-sdk');
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

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

console.log(process.env)
console.log(process.env.AWS_ACCESS_KEY)
console.log(S3_BUCKET)

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
app.use(body_parser.urlencoded())

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



// Add routes here
app.get('/', signin.view);
// app.get('/', index.view);
app.get('/index', index.view);
app.get('/newpost', newpost.view);
app.get('/timeline', timeline.view);
app.get('/map', map.view);
app.get('/navbar', nav.view);
app.get('/contactinfo', contactinfo.view);
app.get('/details', details.view);
app.get('/details/*', details.viewIdAtUrl);
app.get('/searchlist', searchlist.view);
app.get('/category/professional', category.viewProfessional);
app.get('/category/social', category.viewSocial);
app.get('/category/performance', category.viewPerformance);
app.get('/category/political', category.viewPolitical);
app.get('/category/seminars', category.viewSeminars);
app.get('/category/athletics', category.viewAthletics);
app.get('/category/freefood', category.viewFreeFood);
app.get('/category/cornellsponsored', category.viewCornellSponsored);
app.get('/upcoming', searchhandler.lookupUpcomingEvents);
app.get('/search-events-by-keyword/*', searchhandler.lookupEventsByKeyword);

app.get('/sign_s3', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

// app.post('/submit_form', function(req, res){
//     username = req.body.username;
//     full_name = req.body.full_name;
//     avatar_url = req.body.avatar_url;
//     update_account(username, full_name, avatar_url); // TODO: create this function
//     // TODO: Return something useful or redirect
// });



// app.get('/index?searching-events-input=*', searchhandler.lookupEventsByKeyword);
app.post('/event-details', details.get);
app.post('/account/add-account', account.addAccount);
app.post('/account/login', account.findAccount);
app.post('/account/sign-up-name-check', account.nameCheck);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
