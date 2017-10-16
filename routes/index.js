var express, router, ItemSchema, transporter;

express = require('express');
router = express.Router();
ItemSchema = require('../models/item');
transporter = require('../helpers/sendmail');

module.exports = function (app) {
  app.use('/', router);
};

var agenda = [
	{
		from: new Date("2017-10-28 10:00"),
		until: new Date("2017-11-05 22:00"),
		title: 'Basler Weinmesse'
	},
	{
		from: new Date("2017-07-28 18:00"),
		until: new Date("2017-07-28 22:00"),
		title: 'Imhof\'s Wystübli offen'
	},
	{
		from: new Date("2017-07-21 18:00"),
		until: new Date("2017-07-21 22:00"),
		title: 'Imhof\'s Wystübli offen'
	},
	{
		from: new Date("2017-07-14 18:00"),
		until: new Date("2017-07-14 22:00"),
		title: 'Imhof\'s Wystübli offen'
	},
	{
		from: new Date("2017-07-07 18:00"),
		until: new Date("2017-07-07 22:00"),
		title: 'Imhof\'s Wystübli offen'
	},
	{
		from: new Date("2017-06-25 10:00"),
		until: new Date("2017-06-25 19:00"),
		title: 'Räbesunntig offen'
	},
	{
		from: new Date("2017-04-09 14:00"),
		until: new Date("2017-04-09 19:00"),
		title: 'Besenbeiz offen'
	},
	{
		from: new Date("2017-04-08 17:00"),
		until: new Date("2017-04-08 22:00"),
		title: 'Besenbeiz offen'
	},
	{
		from: new Date("2017-04-02 14:00"),
		until: new Date("2017-04-02 19:00"),
		title: 'Besenbeiz offen'
	},
	{
		from: new Date("2017-04-01 17:00"),
		until: new Date("2017-04-01 22:00"),
		title: 'Besenbeiz offen'
	},
	 
	{
		from: new Date("2017-03-26 14:00"),
		until: new Date("2017-03-26 19:00"),
		title: 'Besenbeiz offen'
	},
	{
		from: new Date("2017-03-19 14:00"),
		until: new Date("2017-03-19 19:00"),
		title: 'Besenbeiz offen'
	},
	{
		from: new Date("2017-03-18 17:00"),
		until: new Date("2017-03-18 22:00"),
		title: 'Besenbeiz offen'
	}
];
 
 
router.get('/', function(req, res, next) {
  ItemSchema.find(function(error, shopItems){
		if (error) {
			console.log('Data not found: ', error);
		} else {
      res.render('home.ect', {
      	site : 'home', 
				shopItems: shopItems.slice(0, 2),
				agenda: agenda.sort(function(a, b){return a.from-b.from}).filter(function(element, index, array){
					if(element.until > Date.now()){ return true; }
					return false;
				})
			});
		}
  });

//   res.render('shop', {site : 'shop'});
});

router.get('/about', function(req, res, next){
	res.render('about', {site : 'about'});
});

router.get('/wystuebli', function(req, res, next) {
  res.render('wystuebli', {site : 'wyystuebli'});
});

router.get('/impressum', function(req, res, next) {
  res.render('impressum', {site : 'impressum'});
});


router.get('/agb', function(req, res, next) {
  res.render('agb', {site : 'agb'});
});

router.get('/submit', function(req, res, next){
	res.redirect('/shop');
});


// Send form
router.post('/contact/form', function(req, res, next){

	// Check honeypot
	if (req.body.wineAndDine == "") {
					
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var phone = req.body.phone;
		var email = req.body.email;

		var message = req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // Escaping html message

		var html = "<h1>" + firstName+ " " + lastName + " hat Ihnen eine Nachricht geschrieben</h1> \
									<p>Telefon: " + phone + "</p> \
									<p>Email: " + email + "</p> \
									<p> " + message +"</p>";

		// Send Email
		var mailOptions = {
			from: req.app.locals.config.DEFAULT_SENDER,
			to: req.app.locals.config.EMAIL_ADDRESS,
			subject: 'Neue Nachricht per Kontaktformular', 
			html: html
		};
		 
		transporter.sendMail(mailOptions, function(error, info){
			if(error){ 
        return res.json({
          success: false, 
          message: error.message
        }); 
      }
			
      res.json({
        success: true, 
        message: "Vielen Dank. Wir haben Ihre Nachricht erhalten und melden uns so bald wie möglich bei Ihnen!"
      });

			transporter.close();
		});
		
	}else{
		res.json({
      success: false, 
      message: "Es . Bitte versuchen Sie es erneut!"
    }); 
	}
});

router.get('/contact', function(req, res, next){
	res.render('contact', {site : 'contact'});
});


