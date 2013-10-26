
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var mail = require('./node-email-templates/examples/nodemailer/work.js');

function lookupApt(unit) {
	return { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '4018',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'};
}


var app = express();
var current_selection;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//app.post('/login', passport.authenticate('local', { successRedirect: '/',
//							failureRedirect: '/login'}));

app.post('/login', function(req, res) {
	console.log(req.body);
	res.redirect('/');
});

app.get('/', routes.index);
app.get('/sendMail', function(req, res){
	var dest = current_selection;

	console.log('sending mail');
	mail.sendTxtMsg();
	mail.sendEmail();
	console.log('done sending');
	res.render('mailSent', { dest : JSON.stringify(dest),});
});
app.get('/external', function(req, res){
	var arr2 = new Array();
	var unit = req.param('id');
	var dest = lookupApt(unit);
	current_selection = dest;
	console.log('email ' + dest.email + 'num ' + dest.phonenum + 'name ' + dest.Name[0]);

//	for (var i = 1000; i < 4600; i+=10) {
//		if (i
//		arr.push(i);

	arr2[0] = 'aaa';
	console.log('made it here');
	res.render('external', {
	dest : JSON.stringify(dest),
	});
});
app.get("/login", function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('Login<br>');
	res.write('<form method="POST" action="/login">');
	res.write('<input type="text" name="user"><br>');
	res.write('<input type="password" name="pass"><br>');
	res.write('<input type="submit" name="login" value="Login">');
	res.write('</form>');
	res.end();
});

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
