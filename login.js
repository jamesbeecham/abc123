var db = require('./Database/sequelize_db.js');
var crypto = require('crypto');
var routes = require('./routes');

function checkLoginPassword (params) {
	if (params.Code == 1)
		console.log('Database access failed!! ' + params.Messsage);
	else
		console.log('good');
	//If database did not match the username fail the login
	if (params.entry == null) {
		params.Response.redirect('/login');
		return;
	} else if (params.entry.Username != params.UserAttempt) {
		params.Response.redirect('/login');
		return;
	} else if (params.entry.Password !== crypto.createHmac('sha1', params.entry.PasswordSalt).update(params.PwordAttempt).digest('hex')) {
		params.Response.redirect('/login');
		return;
	} else {
		params.Request.session.logged_in = 'good';
		params.Response.redirect('/');
		return;
	}
}

exports.isLoggedIn = function (req) {
	console.log('here ' + req.session.logged_in);
	return (req.session.logged_in == 'good') ? 0 : 1;
}

exports.validateLogin = function (username, password, params) {
	params['UserAttempt'] = username;
	params['PwordAttempt'] = password;
	db.getDbEntry('login', {where : { Username: username } }, {}, checkLoginPassword, params);
}
