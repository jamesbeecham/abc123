
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
var socket = require('socket.io');

function done () {
	console.log("!!!!!!!!!!!!\n\n");
}
/*var salt = Math.round((new Date().valueOf() * Math.random())) + '';
var pword = crypto.createHmac('sha1', salt).update('kawaski').digest('hex');
*/
var me = {      Name: ['James beecham', 'Rachel Beecham', 'Rachel Houston'],
                Email: ['james.d.beecham@gmail.com', 'rachel.h.beecham@gmail.com'],
                PhoneNumber: ['5125870784@messaging.sprintpcs.com', '5126196434@messaging.sprintpcs.com'],
                Unit: '2018',
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
app.post('/signature', routes.signatureConfirm); 
app.get('/', routes.index);
app.get('/sendMail', routes.sendMail);
app.get('/external', routes.external);
app.get('/login', routes.login);
app.get('/signature', routes.signature);
app.get('/pickup', routes.pickupQuery);
app.get('/users', user.list);
app.get('/search', routes.searchGet);



var httpServer = http.createServer(app).listen(app.get('port'), function(){
   io = socket.listen(httpServer);

	io.sockets.on('connection', function (socket) {
		console.log('Server side connect');
		socket.on('sendSig', function (data) {
			console.log('length ' + JSON.stringify(data).length);
			console.log('here is data rom client ' + JSON.stringify(data));
		});
	});
  console.log('Express server listening on port ' + app.get('port'));
});
