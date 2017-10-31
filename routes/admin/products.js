var express, router, Product, multer, crypto, mime, mkdirp, fs;

multer = require('multer');
express = require('express');
router = express.Router();
crypto = require('crypto');
mime = require('mime');
mkdirp = require('mkdirp');
fs = require('fs');

utils = require('../../utils/AdminUtils');

Product = require('../../models/product');
ProductCat = require('../../models/product_category');

var ViewUtils = require('../../utils/ViewUtils');

// File upload storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    var path = 'public/products/';
    mkdirp.sync(path)
    cb(null, path)
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});
var upload = multer({storage: storage});

// List products
router.get('/', utils.isNotAuthenticatedThenLogin, function (req, res, next) {

  Product.findByCat().exec(function (err, cats) {
    if (err) {
      next(err)
    }
    else {

      console.log("Received cats:");
      console.log(cats);
      return res.render('admin/products/index', {
        active: {products: true},
        utils: ViewUtils,
        cats: cats
      });
    }
  });
});

// Save product
saveProduct = function (req, res, next, product) {

  product.title = req.body.title;
  product.price = req.body.price * 100 ;
  product.description = req.body.description;
  product.visible = req.body.visible;


  ProductCat.findOne({name: req.body.type}, function (err, cat) {
    if (err) {
      next(err);
    }
    else {
      if (!cat) {
        cat = new ProductCat({name: req.body.type});
        cat.save();
      }

      product.type = cat;

      console.log("Cat is: " + JSON.stringify(cat));

      if (req.file) {
        product.avatar = req.file;
      }

      product.save(function (err) {
        if (err) {
          next(err);
        }
        else {
          res.redirect('/admin/products/');
        }
      });

    }
  })

}

router.post('/modify', upload.single('avatar'), function (req, res, next) {
  if (req.body.id) {
    // Update existing product
    Product.findOne({_id: req.body.id}, function (err, product) {
      if (err) { return next(err) }
      if (!product) { return next({status: 400, message: "Product not found."}) }
      else {
        if (req.file && product.avatar) {
          fs.unlink(product.avatar.path, function (err) {
            if (err) {
              console.log(err)
            }
            else {
              console.log("Deleted image: " + product.avatar.path);
            }
          });
        }

        saveProduct(req, res, next, product);
      }
    });
  } else {
    saveProduct(req, res, next, new Product());
  }
});


router.get('/new', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  ProductCat.find(function (err, cats) {
    if (!cats) {
      cats = {}
    }

    return res.render('admin/products/modify', {
      active: {products: true},
      product: {},
      cats: cats,
      root: '/admin/products/'
    });

  });
});

router.get('/modify/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Product.findOne({_id: req.params.id}, function (err, product) {
    if (err) { return next(err); }

    if (!product) { next({status: 400, message: "Product not found!"}); } 
    else {
      ProductCat.find(function (err, cats) {
        if (!cats) {
          cats = {}
        }

        console.log(ViewUtils);

        return res.render('admin/products/modify', {
          active: {products: true},
          product: product,
          root: '/admin/products/',
          cats: cats,
          utils: ViewUtils,
        });
      });
    }
  });
});

router.post('/delete', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  console.log("Deleting id: " + req.body.id)
  Product.findOne({_id: req.body.id}, function (err, product) {
    if (err) {
      return res.json(err)
    }
    if (!product) {
      return res.json({status: 400, message: "Product not found."})
    }
    else {
      product.remove(function (err) {
        if (err) {
          res.json(err)
        }
        else {
          res.json({
            status: 200,
            message: "Successfully deleted product."
          });

          if (product.avatar) {
            fs.unlink(product.avatar.path, function (err) {
              if (err) {
                console.log(err)
              }
              else {
                console.log("Deleted image: " + product.avatar.path);
              }
            });
          }
        }
      });
    }
  });
});

module.exports = router;
