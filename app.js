
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var m = require('./public/javascripts/something.js');

var app = express();

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

app.get('/', routes.index);
app.get('/external', function(req, res){
	var arr2 = new Array();


//	for (var i = 1000; i < 4600; i+=10) {
//		if (i
//		arr.push(i);

	arr2[0] = 'aaa';
	console.log('made it here');
	res.render('external', {
	unit: JSON.stringify(arr2),
	fs : { sayHi: m.doSomething } });
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
