var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = undefined;

transporter = nodemailer.createTransport(smtpTransport({
  host: 'email-smtp.eu-west-1.amazonaws.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PW
   }
}));


module.exports = transporter;
