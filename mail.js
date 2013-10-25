
// # node-email-templates

// ## Example with [Nodemailer](https://github.com/andris9/Nodemailer)

var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
  , emailTemplates = require('../../')
  , nodemailer     = require('nodemailer');

emailTemplates(templatesDir, function(err, template) {

  if (err) {
    console.log(err);
  } else {

    // ## Send a single email

    // Prepare nodemailer transport object
    var transport = nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: "james.d.beecham",
        pass: "JBDash56"
      }
    });

    // An example users object with formatted email function
    var locals = {
      email: 'rachel.h.beecham@gmail.com',
      name: {
        first: 'Mamma',
        last: 'Mia'
      }
    };

    // Send a single email
    template('newsletter', locals, function(err, html, text) {
      if (err) {
        console.log(err);
      } else {
        transport.sendMail({
          from: 'Spicy Meatball <spicy.meatball@spaghetti.com>',
          to: locals.email,
          subject: 'Mangia gli spaghetti con polpette!',
          html: html,
          // generateTextFromHTML: true,
          text: text
        }, function(err, responseStatus) {
          if (err) {
            console.log(err);
          } else {
            console.log(responseStatus.message);
          }
        });
      }
    });
 }

});

