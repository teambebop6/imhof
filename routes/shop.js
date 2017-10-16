var express , router, request, transporter, config, mongoose, Item, expressValidator, ECT, renderer, Cookies;

express = require('express');
router = express.Router();
request = require('request');
transporter = require('../helpers/sendmail');
config = require('../config');
mongoose = require('mongoose')
Product = require('../models/product');
ProductCategory = require('../models/product_category');
expressValidator = require('express-validator');
Cookies = require('cookies');
utils = require('../utils/Utils');

var _shopItems; 
ECT = require('ect');
renderer = ECT({ watch: true, root: config.ROOT + '/views', ext : '.ect' });

router.use(expressValidator([]));

router.get('/', function(req, res, next) {
	Product.findByCat({'visible' : true}).exec(function(err, cats){
		if (err) { return next(err);	} 

    res.render('shop.ect', {
      site : 'shop',	 
      cats: cats
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
        product: product
      });
    }
  });
});


router.get('/buy', utils.ifNoItemsInCookiesThenRedirect, function(req, res, next){
  var items = JSON.parse(req.cookies.itemsToBuy);

  var ids = items.map(function(item){
    return item._id
  });

  Product.find({_id: { $in: ids}}).exec(function(err, products){
    if(err){return next(err);}
    if(!products){return next({status: 400, message: "No products found."}); }
    else{
      products.forEach(function(product){
        index = items.findIndex(function(obj) {
          return obj._id == product._id;
        });

        items[index].details = product;
      });

      var viewItems = items.map(function(item){
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
        totalPrice: total
      });
    }
  });
});

router.get('/cart', function(req, res, next){
  var items = JSON.parse(req.cookies.itemsToBuy);

  var ids = items.map(function(item){
    return item._id
  });

  Product.find({_id: { $in: ids}}).exec(function(err, products){
    if(err){return next(err);}
    if(!products){return next({status: 400, message: "No products found."}); }
    else{
      products.forEach(function(product){
        index = items.findIndex(function(obj) {
          return obj._id == product._id;
        });

        items[index].details = product;
      });

      console.log(items);

      res.render('cart', {
        items: items
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

// Lammfleisch
router.get('/lammfleisch', function(req, res, next){
  res.render('lammfleisch');
});


var getFullProductsInfo = function(items){
  return new Promise(function(resolve, reject){
    var ids = items.map(function(item){
      return item._id
    });

    Product.find({_id: { $in: ids}}).exec(function(err, products){
      if(err){ reject(err); }
      if(!products){return reject({status: 400, message: "No products found."}); }
      else{
        products.forEach(function(product){
          index = items.findIndex(function(obj) {
            return obj._id == product._id;
          });

          items[index].details = product;
        });

        return resolve(items);
      }
    });
  });

}


// Submit order 
router.post('/order', utils.ifNoItemsInCookiesThenRedirect, function(req, res, next){
  itemsToBuy = JSON.parse(req.cookies.itemsToBuy);

  // Check honeypot field
  if(req.body.wineAndDine != ""){ 
    return res.json({
      success: false, 
      message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!"
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
    return res.json({success: false, message: errors[0].msg});
  }

  var clientContact = {
    firstName: req.body['firstName'],
    lastName: req.body['lastName'],
    address: req.body['address'],
    email: req.body['email'],
    phone: req.body['phone']
  };

  var items = JSON.parse(req.cookies.itemsToBuy);

  getFullProductsInfo(items).then(function(items){

    var total = 0;

    items.forEach(function(item){
      item.subtotal = item.itemsAmount * item.details.price;
      total += subtotal;
    });

    var html = renderer.render('../views/emails/order.ect', { 
      'customer' : clientContact,
      'items' : items,
      'total' : total
    });

    var mailOptions = {
      from: req.app.locals.config.DEFAULT_SENDER || 'Imhof\'s Wein und Obstbau <noreply@imhof-weine.ch>',
      to: req.app.locals.config.EMAIL_ADDRESS,
      subject: 'Neue Bestellung von ' + clientContact.firstName + ' ' + clientContact.lastName + ' auf imhof-weine.ch', 
      html: html
    };

    console.log("Sending mail...");

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        res.json({success: false, message: "Nachricht konnte nicht übermittelt werden."})
      }
      else{
        res.clearCookie('itemsToBuy');
        res.json({success: true, message: "Ihre Bestellung wurde erfolgreich gesendet!"});
      }

      transporter.close();
    });

  }, function(err){
    return next(err);
  });


  return;

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
  if(req.body.wineAndDine != ""){ res.json({success: false, message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!"}); return;}

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

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      res.json({success: false, error: error});
    }
    else{
      res.json({success: true});
    }

    transporter.close();
  });
});

module.exports = function (app) {
  app.use('/shop', router);
};

