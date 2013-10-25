var m = require('./node-email-templates/examples/nodemailer/mail.js');


exports.done = function () {
	console.log('done1');
}

m.sendMessages();
