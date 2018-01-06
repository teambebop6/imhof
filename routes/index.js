var express, router, ItemSchema;

express = require('express');
router = express.Router();
ItemSchema = require('../models/item');
Event = require('../models/event');
Showcase = require('../models/showcase');
Product = require('../models/product');
ProductService = require('../services/product');

Grape = require('../models/grape');

const moment = require('moment');
moment.locale("de");

module.exports = function (app) {
  app.use('/', router);
};

env = process.env.NODE_ENV || "development";

// To test shop email
if(env == "development"){
  router.get('/testemail', function(req, res, next){
    var customer = {
      firstName: "Florian",
      lastName: "Rudin",
      address: "Kienbergweg 15",
      email: "flaudre@gmail.com",
      phone: "0619714440"
    };

    Product.find().limit(5).lean().exec(function(err, items){
      if(err){ return err; }


      ProductService.getFullProductsInfo(items).then(function(items){
       
        var total = 0;
        items.forEach(function(item, index){
          items[index].itemsAmount = 5;
          items[index].subtotal = item.itemsAmount * item.details.price;
          total += items[index].subtotal;
        })

        console.log(total);
        res.render('emails/order', {
          items: items,
          customer: customer,
          total: total,
          utils: ViewUtils,
        });
      });
    });
  });
}

router.get('/', function (req, res, next) {
  ItemSchema.find(function (error, shopItems) {
    if (error) {
      console.log('Data not found: ', error);
    } else {
      Event.find(function (err, events) {
        if (err) {
          next(err)
        } else {

          // showcase
          // TODO only latest now
          Showcase.find({visible: true}).sort({visible: -1, last_modified_date: -1}).exec(function(err, showcases) {
            if (err) {
              next(err)
            } else {
              res.render('home.ect', {
                site: 'home',
                shopItems: shopItems.slice(0, 2),
                moment: moment,
                agenda: events.sort(function (a, b) {
                  return a.begin - b.begin
                }).filter(function (element, index, array) {
                  return element.end > Date.now();
                }),
                showcases: showcases
              });
            }
          });
        }
      })
    }
  });

  //   res.render('shop', {site : 'shop'});
});

router.get('/about', function (req, res, next) {

  Grape.find().sort({_id: 'asc'}).exec(function(err, grapes){
    if(err){ return next(err); }
    
    res.render('about', {
      site: 'about',
      grapes: grapes
    });
  })

});

router.get('/wystuebli', function (req, res, next) {
  res.render('wystuebli', {site: 'wyystuebli'});
});

router.get('/impressum', function (req, res, next) {
  res.render('impressum', {site: 'impressum'});
});


router.get('/agb', function (req, res, next) {
  res.render('agb', {site: 'agb'});
});

router.get('/submit', function (req, res, next) {
  res.redirect('/shop');
});


// Send form
router.post('/contact/form', function (req, res, next) {

  // Check honeypot
  if (req.body.wineAndDine == "") {

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phone = req.body.phone;
    var email = req.body.email;

    var message = req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // Escaping html message

    var html = "<h1>" + firstName + " " + lastName + " hat Ihnen eine Nachricht geschrieben</h1> \
                <p>Telefon: " + phone + "</p> \
                <p>Email: " + email + "</p> \
                <p> " + message + "</p>";

    // Send Email
    var mailOptions = {
      from: req.app.locals.config.DEFAULT_SENDER,
      to: req.app.locals.config.EMAIL_ADDRESS,
      subject: 'Neue Nachricht per Kontaktformular',
      html: html
    };

    req.app.locals.smtp_transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({
          success: false,
          message: error.message
        });
      }

      res.json({
        success: true,
        message: "Vielen Dank. Wir haben Ihre Nachricht erhalten und melden uns so bald wie möglich bei Ihnen!"
      });

      req.app.locals.smtp_transporter.close();
    });

  } else {
    res.json({
      success: false,
      message: "Es . Bitte versuchen Sie es erneut!"
    });
  }
});

router.get('/contact', function (req, res, next) {
  res.render('contact', {site: 'contact'});
});


