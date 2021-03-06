var express , router, request, mongoose, Item, expressValidator, Cookies;

express = require('express');
router = express.Router();
request = require('request');
mongoose = require('mongoose');
Product = require('../models/product');
ProductCategory = require('../models/product_category');
expressValidator = require('express-validator');
Cookies = require('cookies');
var utils = require('../utils/Utils');
ViewUtils = require('../utils/ViewUtils');
ProductService = require('../services/product');
var moment = require('moment');

module.exports = function (app) {
  app.use('/shop', router);
};

router.use(expressValidator([]));

router.get('/', function(req, res, next) {
  Product.findByCat({'visible' : true}).exec(function(err, cats){
    if (err) { return next(err);	} 

    console.log(cats);

    Product.find().limit(5).exec(function(err, favs){
      if (err) { return next(err);	}

      console.log(favs);

      res.render('shop.ect', {
        site : 'shop',	 
        cats: cats,
        favs: favs,
        moment: moment,
      });
    });
  });
});

router.get('/:id(\\d+)/', function(req, res, next) {
  Product.findOne({_id: req.params.id}, function(err, product){
    if(err){return next(err)};
    if(!product){
      next({status: 400, message: "Product not found!"});
    }else{
      return res.render('item', {
        active: {products: true },
        product: product,
        utils: ViewUtils,
        moment: moment,
      });
    }
  });
});


router.get('/buy', utils.getCartItems, function(req, res, next){
  var ids = req.items.map(function(item){ return item._id });

  Product.find({_id: { $in: ids}}).exec(function(err, products){
    if(err){return next(err);}
    if(!products){return next({status: 400, message: "No products found."}); }
    else{
      products.forEach(function(product){
        index = req.items.findIndex(function(obj) {
          return obj._id == product._id;
        });

        req.items[index].details = product;
      });

      var viewItems = req.items.map(function(item){
        return {
          _id: item._id,
          avatar: item.details.avatar ? item.details.avatar.filename : undefined,
          title: item.details.title,
          price: item.details.price,
          subtotal: item.itemsAmount * item.details.price
        }
      });

      var total = viewItems.map(function(item){return item.subtotal}).reduce(function(a, b) { return a + b; });

      res.render('buy', {
        items: viewItems,
        totalPrice: total,
        utils: ViewUtils,
      });
    }
  });
});

router.get('/cart', utils.getCartItems, function(req, res, next){
  var ids = req.items.map(function(item){ return item._id });

  Product.find({_id: { $in: ids}}).exec(function(err, products){
    if(err){return next(err);}
    if(!products){return next({status: 400, message: "No products found."}); }
    else{
      products.forEach(function(product){
        index = req.items.findIndex(function(obj) {
          return obj._id == product._id;
        });

        req.items[index].details = product;
      });

      console.log(req.items);

      res.render('cart', {
        items: req.items,
        utils: ViewUtils,
      });
    }
  }); 
});

router.post('/get_item', function(req, res, next){

  Item.findOne({'html_id': req.body.id}, function(error, item){
    if(error){
      console.log(error);
      res.render('');
    } else{
      res.json(item);
    }

  });
});

// Submit order 
router.post('/order', utils.ifNoItemsInCookiesThenRedirect, function(req, res, next){
  itemsToBuy = JSON.parse(req.cookies.itemsToBuy);

  // Check honeypot field
  if(req.body.wineAndDine != ""){ 
    return res.json({status: 400, message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!"
    }); 
  }

  // Express Validation
  req.checkBody('firstName', 'Vorname bitte zwischen 2 und 50 Zeichen eingeben').isLength(2,50);
  req.checkBody('lastName', 'Name bitte zwischen 2 und 50 Zeichen eingeben').isLength(2,50);
  req.checkBody('address', 'Adresse bitte zwischen 2 und 100 Zeichen eingeben').isLength(2,100);
  req.checkBody('email', 'Ungültige Email-Adresse').isEmail();
  req.checkBody('phone', 'Telefonnummer bitte nur Nummern eingeben').isNumeric();

  var errors = req.validationErrors();
  if(errors){
    return res.json({status: 400, message: errors[0].msg});
  }

  var clientContact = {
    firstName: req.body['firstName'],
    lastName: req.body['lastName'],
    address: req.body['address'],
    email: req.body['email'],
    phone: req.body['phone']
  };

  var items = JSON.parse(req.cookies.itemsToBuy);

  ProductService.getFullProductsInfo(items).then(function(items){

    var total = 0;
    items.forEach(function(item, index){
      items[index].subtotal = item.itemsAmount * item.details.price;
      total += items[index].subtotal;
    })

    var html = req.app.locals.ect_renderer.render('../views/emails/order.ect', { 
      customer: clientContact,
      items: items,
      total: total,
      utils: ViewUtils,
    });

    var mailOptions = {
      from: req.app.locals.config.DEFAULT_SENDER || 'Imhof\'s Wein und Obstbau <noreply@imhof-weine.ch>',
      to: req.app.locals.config.EMAIL_ADDRESS,
      subject: 'Neue Bestellung von ' + clientContact.firstName + ' ' + clientContact.lastName + ' auf imhof-weine.ch', 
      html: html
    };

    console.log("Sending email to " + req.app.locals.config.EMAIL_ADDRESS);

    req.app.locals.smtp_transporter.sendMail(mailOptions, function(error, info){
      if(error){
        res.json({status: 400, message: "Nachricht konnte nicht übermittelt werden."})
      }
      else{

        // Clear cart
        res.clearCookie('itemsToBuy');

        res.json({status: 200, message: "Ihre Bestellung wurde erfolgreich gesendet!"});
      }

      req.app.locals.smtp_transporter.close();
    })
  }).catch(function(err){
    console.log(err);
    res.json({status: 400, message: "Entschuldigung. Es trat ein Fehler auf."})
  });
});

// Preorder Lammfleisch
router.post('/preorder', function(req, res){

  var phone = req.body.phone;
  var firstName = req.body['firstName'];
  var lastName = req.body['lastName'];
  var text = req.body.text;
  var email = req.body.email;

  if(!phone || !email || !firstName || !lastName || !text){ 

    res.json({
      success: false,
      message: "Es wurden nicht alle Felder ausgefüllt"
    });
    return; 
  }

  // Check honeypot field
  if(req.body.wineAndDine != ""){ 
    res.json({status: 400, message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!"}); return;}

  // Create message
  var message = req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // Escaping html message
  var html = "<h1>Es ist eine neue Lammfleisch-Vorbestellung eingetroffen</h1><p>von <i>" + req.body.firstName + " " + req.body.lastName + "</i></p><p>Telefon: "+ req.body['phone'] +"</p><p>Email: "+ req.body['email'] +"</p><p>"+ message +"</p>";

  // Send Email
  var mailOptions = {
    from: req.app.locals.config.DEFAULT_SENDER || 'Imhof\'s Wein und Obstbau <noreply@imhof-weine.ch>',
    to: req.app.locals.config.EMAIL_ADDRESS,
    subject: 'Neue Lammfleisch-Vorbestellung', 
    html: html
  };

  req.app.locals.smtp_transporter.sendMail(mailOptions, function(error, info){
    if(error){
      res.json({status: 400, error: error});
    }
    else{
      res.json({status: 200, message: "Besten Dank! Ihre Vorbestellung wurde erfolgreich versendet. Sie hören von uns!"});
    }

    req.app.locals.smtp_transporter.close();
  });
});

