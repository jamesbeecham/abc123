
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var db = require('./Database/db.js');
var app = express();
var current_selection;
var crypto = require('crypto');


function done () {
	console.log("!!!!!!!!!!!!\n\n");
}
/*var salt = Math.round((new Date().valueOf() * Math.random())) + '';
var pword = crypto.createHmac('sha1', salt).update('kawaski').digest('hex');
*/
var me = {      Name: ['James beecham', 'Rachel Beecham', 'Rachel Houston'],
                Email: ['james.d.beecham@gmail.com', 'rachel.h.beecham@gmail.com'],
                PhoneNumber: ['5125870784@messaging.sprintpcs.com', '5126196434@messaging.sprintpcs.com'],
                Unit: '4018',
		SeqNumber: 1,
        }

//db.addUnitEntry(me, 'u235wvb', done); 

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({secret: 'iambatman'}));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/search', routes.searchPost);
app.post('/login', routes.loginPost);
 
app.get('/', routes.index);
app.get('/sendMail', routes.sendMail);
app.get('/external', routes.external);
app.get('/login', routes.login);
app.get('/users', user.list);
app.get('/search', routes.searchGet);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
