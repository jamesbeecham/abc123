var mail = require('../node-email-templates/examples/nodemailer/work.js');
var login = require('../login.js');

exports.loginPost = function (req, res) {
	var username = req.param('username');
	var password = req.param('password');

	login.validateLogin(username, password, { Request: req, Response: res});
}

exports.searchPost = function (req, res) {
	if (login.isLoggedIn(req) == 1) {
		res.redirect('/login');
		return;
 	}
	console.log(req.body + 'posting the search data');
        var unitQuery = req.param('unitSubmit');

        res.redirect('/external?id='+unitQuery);
}

exports.sendMail = function (req, res) {
	if (login.isLoggedIn(req) == 1) {
		res.redirect('/login');
		return;
 
	}
	var dest = current_selection;

        console.log('sending mail');
        mail.sendTxtMsg();
        mail.sendEmail();
        console.log('done sending');
        res.render('mailSent', { dest : JSON.stringify(dest),});
}

exports.external = function (req, res) {
	if (login.isLoggedIn(req) == 1) {
		res.redirect('/login');
		return;
	}
	var unit = req.param('id');
	var dest = {};

        res.render('external', {
        dest : JSON.stringify(dest),
        });
}

exports.login = function (req, res) {
	console.log('rendering login');
	res.render('login');
};
/*
 * GET home page.
 */
exports.index = function(req, res){
	console.log('getting here');
	if (login.isLoggedIn(req) == 1) {	
		res.redirect('/login');
		return;
	}
	console.log('array filled in');
	res.render('index');
};
