var m = require('./node-email-templates/examples/nodemailer/work.js');


exports.done = function () {
	console.log('done1');
}

m.sendMsg();
