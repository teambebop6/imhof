var express, router, ItemSchema;

express = require('express');
router = express.Router();
ItemSchema = require('../models/item');
Event = require('../models/event');
Showcase = require('../models/showcase');
Product = require('../models/product');
ProductService = require('../services/product');

Grape = require('../models/grape');
Citation = require('../models/citation');

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
      const limit = req.app.locals.config.AGENDA_LIMIT || 4;
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
                }).slice(0, limit),
                showcases: showcases
              });
            }
          });
        }
      })
    }
  });
});

router.get('/agenda', function (req, res, next) {
  Event.find(function (err, events) {
    if (err) {
      next(err)
    } else {

      var upcomingEvents = events.filter(function(event){
        return moment(event.begin).diff(Date.Now, 'days') <= 0
      });

      var pastEvents = events.filter(function(event){
        return moment(event.begin).diff(Date.Now, 'days') > 0
      })

      res.render('agenda.ect', {
        site: 'agenda',
        moment: moment,
        upcomingEvents: upcomingEvents.sort(function (a, b) {
          return a.begin - b.begin
        }),
        pastEvents: pastEvents.sort(function (a, b) {
          return b.begin - a.begin
        }),
      });
    }
  })
});

defaultCitation = {
  words: 'Über Generationen hinweg wurden Erfahrungen im Weinbau weitergegeben, ebenso wie Qualitätsbewusstsein und die Liebe zum Wein. ',
  author: 'Janina Imhof, Oenologin in Ausbildung',
};

router.get('/about', function (req, res, next) {

  Grape.find().sort({_id: 'asc'}).exec(function(err, grapes){
    if(err){ return next(err); }

    Citation.find({visible: true}, function (err, citations) {
      res.render('about', {
        site: 'about',
        grapes: grapes,
        citations: citations && citations.length > 0 ? citations: [defaultCitation],
      });
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

  console.log(req.body);

  // honeypot
  if(req.body.wineAndDine){
    console.log("Trapped in honeypot.");
    return res.status(500).json({ 
      message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!" 
    });
  }

  var sender = "";
  if(req.body.firstName || req.body.lastName){ sender = req.body.firstName + " " + req.body.lastName }
  else{
    sender = req.body.name
  }

  var contactMethodBlock = "";

  if(req.body.phoneOrEmail){
    contactMethodBlock += "<p>Kontakt: " + req.body.phoneOrEmail + "</p>";
    console.log(contactMethodBlock);
  }else{
    if(req.body.phone){
      contactMethodBlock += "<p>Telefon: " + req.body.phone + "</p>";
    }
    if(req.body.email){
      contactMethodBlock += "<p>Email: " + req.body.email + "</p>";
    }
  }

  console.log(contactMethodBlock);

  var messageBlock = "<p>" + req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br />') + "</p>"; // Escaping html message

  var titleBlock = "<h1>" + sender + " hat Ihnen eine Nachricht geschrieben</h1>";


  var html = titleBlock + contactMethodBlock + messageBlock;          

  // Send Email
  var mailOptions = {
    from: req.app.locals.config.DEFAULT_SENDER,
    to: req.app.locals.config.EMAIL_ADDRESS,
    subject: 'Neue Nachricht per Kontaktformular',
    html: html
  };

  req.app.locals.smtp_transporter.sendMail(mailOptions, function (err, info) {
    if (err) { return res.json(err); }

    res.json({
      message: "Vielen Dank. Wir haben Ihre Nachricht erhalten und melden uns so bald wie möglich bei Ihnen!"
    });

    req.app.locals.smtp_transporter.close();
  });
});

router.get('/contact', function (req, res, next) {
  res.render('contact', {site: 'contact'});
});


