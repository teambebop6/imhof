var express, router, Showcase;

express = require('express');
router = express.Router();

var moment = require('moment');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var mkdirp = require('mkdirp');
var fs = require('fs');

utils = require('../../utils/AdminUtils');

Showcase = require('../../models/showcase');

// File upload storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var path = 'public/showcases/';
    mkdirp.sync(path);
    cb(null, path)
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});
var upload = multer({storage: storage});

// List Showcases
router.get('/', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Showcase.find(function (err, showcases) {
    if (err) {
      next(err)
    }
    else {
      return res.render('admin/showcases/index', {
        active: {showcases: true},
        showcases: showcases,
        moment: moment
      });
    }
  });
});

// Save showcase
saveShowcase = function (req, res, next, showcase) {

  showcase.title = req.body.title;
  showcase.detail = req.body.detail;
  showcase.visible = req.body.visible;

  if (req.file) {
    showcase.avatar = req.file;
  }

  showcase.save(function (err) {
    if (err) {
      next(err);
    }
    else {
      res.redirect('/admin/showcases/');
    }
  });
};

router.post('/modify', upload.single('avatar'), function (req, res, next) {

  console.log(req.body);

  if (req.body.id) {
    // Update existing showcase
    Showcase.findOne({_id: req.body.id}, function (err, showcase) {
      if (err) {
        return next(err)
      }
      if (!showcase) {
        return next({status: 400, message: "Showcase not found."})
      } else {

        if (req.file && showcase.avatar) {
          fs.unlink(showcase.avatar.path, function (err) {
            if (err) {
              console.log(err)
            }
            else {
              console.log("Deleted image: " + showcase.avatar.path);
            }
          });
        }

        saveShowcase(req, res, next, showcase);
      }
    });
  } else {

    console.log("Req body is:");
    console.log(req.body);

    saveShowcase(req, res, next, new Showcase());
  }
});


router.get('/new', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  return res.render('admin/showcases/modify', {
    active: {showcases: true},
    showcase: {}
  });
});

router.get('/modify/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Showcase.findOne({_id: req.params.id}, function (err, showcase) {
    if (err) {
      next(err)
    }
    if (!showcase) {
      next({status: 400, message: "Showcase not found!"});
    } else {
      return res.render('admin/showcases/modify', {
        active: {showcases: true},
        showcase: showcase
      });
    }
  });
});

router.post('/delete', utils.isNotAuthenticatedThenLogin, function (req, res, next) {

  Showcase.findOne({_id: req.body.id}, function (err, showcase) {
    if (err) {
      return res.json(err)
    }
    if (!showcase) {
      return res.json({status: 400, message: "Showcase not found."})
    }
    else {
      showcase.remove(function (err) {
        if (err) {
          res.json(err)
        }
        else {
          res.json({
            status: 200,
            message: "Successfully deleted showcase."
          });
          if (showcase.avatar && showcase.avatar.path) {
            fs.unlink(showcase.avatar.path, function (err) {
              if (err) {
                console.log(err)
              }
              else {
                console.log("Deleted image: " + showcase.avatar.path);
              }
            });
          }
        }
      });
    }
  });
});

module.exports = router;
