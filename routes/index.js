var mail = require('../node-email-templates/examples/nodemailer/index.js');
var login = require('../login.js');
var db = require('../Database/db.js');

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
	//FIXME do hardcode this. get this from the user session!!!
	//FIXME dont hae the null in this call maybe? restructre or fuck it?
	db.searchForUnit(unitQuery, req.session.table, null, { Request: req, Response: res});
}

exports.searchGet = function (req, res) {
	res.redirect('/');
}

exports.sendMail = function (req, res) {
	if (login.isLoggedIn(req) == 1) {
		res.redirect('/login');
		return;
 
	}
	var pendingUnit = req.param('pendingUnit');
	var pendingSeqNum = req.param('pendingSeqNum');

	var email = req.param('email').split(',');
	console.log('look here' + JSON.stringify(email));
	var phonenum = req.param('phone').split(',');
	console.log('look agagin ' + JSON.stringify(phonenum));
        console.log('sending mail');
	mail.sendMessages(JSON.stringify(email.concat(phonenum)), { Request: req, Response: res}, pendingUnit, pendingSeqNum);
        console.log('done sending');
}

exports.external = function (req, res, dest) {
	if (login.isLoggedIn(req) == 1) {
		res.redirect('/login');
		return;
	}

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
