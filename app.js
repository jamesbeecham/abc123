
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

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
var buttons =[{ Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '1018',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '1002',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '2002',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '2202',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '3004',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '3002',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '5102',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '4612',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '4018',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'},
	       { Name: ['James Beecham', ' Rachel Beecham'],
		 Unit: '1562',
		email: 'james.d.beecham@gmail.com',
		phonenum: '5125870784',
		carrier: 'sprint'}];


function lookupApt(unit) {
	for (var ii = 0; ii<buttons.length; ii++)
		if (buttons[ii].Unit == unit)
			return buttons[ii];
}

var users = [ { Username: 'beecham', Password: 'kawaski', TableId: 0}, { Username: 'chris', Password: 'walla', TableId: 1}, { Username: 'rachel', Password: 'jack', TableId: 2}];


function findUserByName (name) {
	for (user in users) {
		if (users[user].Username == name)
			return users[user];
	}

	return 'null';
}

function validateLogin(username, password) {
	var user = findUserByName(username);
	
	if (user == 'null')
		return 'bad';
	if (user.Username == username && user.Password == password)
		return 'good';
	else
		return 'bad';
}

var app = express();
var current_selection;

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
//app.post('/login', passport.authenticate('local', { successRedirect: '/',
//							failureRedirect: '/login'}));

app.post('/login', function(req, res) {
	console.log(req.body);
	if (validateLogin(req.param('username'), req.param('password')) == 'good') {
		req.session.logged_in = 'yes';
		res.redirect('/');
	} else {
		res.redirect('/login');
	}
});

app.get('/', function(req, res) {
	var date = new Date();
	console.log('day number ' + date.getDay());
	console.log('checking session ' + req.session.loggin_in);
	if (typeof req.session.logged_in !== "undefined") {
		console.log('person is logged in ' + req.session.logged_in);
		routes.index(req, res, sortByKey(buttons, 'Unit'));
	} else {
		console.log('person is not loggin in!! ' + req.session.logged_in);
		res.redirect('/login');
	}
});
app.get('/sendMail', function(req, res){
	var dest = current_selection;

	console.log('sending mail');
	mail.sendTxtMsg();
	mail.sendEmail();
	console.log('done sending');
	res.render('mailSent', { dest : JSON.stringify(dest),});
});
app.get('/external', function(req, res){
	var unit = req.param('id');
	var dest = lookupApt(unit);
	current_selection = dest;
	console.log(unit+ 'email ' + dest.email + 'num ' + dest.phonenum + 'name ' + dest.Name[0]);


	res.render('external', {
	dest : JSON.stringify(dest),
	});
});
/*app.get("/login", function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('Login<br>');
	res.write('<form method="POST" action="/login">');
	res.write('<input type="text" name="user"><br>');
	res.write('<input type="password" name="pass"><br>');
	res.write('<input type="submit" name="login" value="Login">');
	res.write('</form>');
	res.end();
});
*/
app.get('/login', function(req, res) {
	console.log('about to login');
	res.render('login');
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
