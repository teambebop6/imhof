var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = undefined;

module.exports = function(config){
  return transporter = nodemailer.createTransport(smtpTransport({
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 465,
    secure: true,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PW,
    }
  }));
}
