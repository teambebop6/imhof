var express, router, Product, multer, crypto, mime, mkdirp, fs;

multer = require('multer');
express = require('express');
router = express.Router();
crypto = require('crypto');
mime = require('mime');
mkdirp = require('mkdirp');
fs = require('fs');
path = require('path');

utils = require('../../utils/AdminUtils');

Product = require('../../models/product');
ProductCat = require('../../models/product_category');

var ViewUtils = require('../../utils/ViewUtils');

// File upload storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    var p = path.join(req.app.locals.config.UPLOAD_FOLDER, '/products');
    mkdirp.sync(p)
    cb(null, p)
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage });

// List products
router.get('/', utils.isNotAuthenticatedThenLogin, function (req, res, next) {

  Product.findByCat().exec(function (err, cats) {
    if (err) {
      next(err)
    }
    else {
      // console.log("Received cats:");
      // console.log(JSON.stringify(cats));
      return res.render('admin/products/index', {
        active: { products: true },
        utils: ViewUtils,
        cats: cats
      });
    }
  });
});

// Save product
saveProduct = function (req, res, next, product) {

  product.title = req.body.title;
  product.price = req.body.price * 100;
  product.description = req.body.description;
  product.visible = req.body.visible;


  ProductCat.findOne({ name: req.body.type }, function (err, cat) {
    if (err) {
      next(err);
    }
    else {
      if (!cat) {
        cat = new ProductCat({ name: req.body.type });
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
};

router.post('/modify', upload.single('avatar'), function (req, res, next) {
  if (req.body.id) {
    // Update existing product
    Product.findOne({ _id: req.body.id }, function (err, product) {
      if (err) {
        return next(err)
      }
      if (!product) {
        return next({ status: 400, message: "Product not found." })
      }
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
      active: { products: true },
      product: {},
      cats: cats,
      root: '/admin/products/',
      utils: ViewUtils,
    });

  });
});

router.get('/modify/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Product.findOne({ _id: req.params.id }, function (err, product) {
    if (err) {
      return next(err);
    }

    if (!product) {
      next({ status: 400, message: "Product not found!" });
    }
    else {
      ProductCat.find(function (err, cats) {
        if (!cats) {
          cats = {}
        }

        console.log(ViewUtils);

        return res.render('admin/products/modify', {
          active: { products: true },
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
  Product.findOne({ _id: req.body.id }, function (err, product) {
    if (err) {
      return res.json(err)
    }
    if (!product) {
      return res.json({ status: 400, message: "Product not found." })
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

router.post('/visible', utils.isNotAuthenticatedThenLogin, function (req, res, next) {

  var id = req.body.id;
  var visible = req.body.visible;

  if (id) {
    // Update existing Citation
    Product.findOne({ _id: id }, function (err, product) {
      if (err) {
        return next(err)
      }
      if (!product) {
        return next({ status: 400, message: "Product not found." })
      } else {
        product.visible = visible;
        product.save(function (err) {
          if (err) {
            next(err);
          }
          else {
            res.json({ status: 200 })
          }
        });
      }
    });
  } else {
    return res.json({ status: 400, message: "Product not found." })
  }
});

function sortCat(up, req, res, next) {
  var id = req.params.id;
  if (id) {
    // TODO
    console.log(id, up);

    ProductCat.findOne({ _id: id }, function (err, pc) {
      if (err) {
        return next(err);
      }
      if (!pc || pc.order === 0) {
        console.log(`cannot find product with id ${id} or order is min`);
        return res.redirect('/admin/products/');
      }
      var cond = {
        order: {}
      };
      var sort = {};
      var currentOrder = pc.order;
      if (up) {
        cond.order[ '$gt' ] = currentOrder || -1;
        sort.order = 1;
      } else {
        cond.order[ '$lt' ] = currentOrder || -1;
        sort.order = -1;
      }
      console.log(cond);
      ProductCat.find(cond).sort(sort).limit(1).exec(function (err, otherPcs) {
        if (err) {
          return next(err);
        }
        if (otherPcs && otherPcs.length > 0) {
          var otherPc = otherPcs[ 0 ];
          var newOrder = otherPc.order;
          pc.order = newOrder;
          pc.save(function (err) {
            if (err) {
              return next(err);
            }
            otherPc.order = currentOrder;
            otherPc.save(function (err) {
              if (err) {
                return next(err);
              }
              return res.redirect('/admin/products/');
            });
          })
        } else {
          return res.redirect('/admin/products/');
        }
      })
    });
  } else {
    return res.redirect('/admin/products/');
  }
}

router.get('/sort_down/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  return sortCat(false, req, res, next);
});

router.get('/sort_up/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  return sortCat(true, req, res, next);
});

module.exports = router;
