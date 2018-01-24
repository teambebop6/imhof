var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  path = require('path');

utils = require('../../utils/AdminUtils');

module.exports = function (app) {
  //app.locals.active = {}

  // Load controllers
  app.use('/admin/events', require('./events'));
  app.use('/admin/products', require('./products'));
  app.use('/admin/showcases', require('./showcases'));
  app.use('/admin/citations', require('./citations'));
  app.use('/admin', router);

  // ERROR HANDLERS
  //


  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use("/admin", utils.isNotAuthenticatedThenLogin, function(err, req, res, next) {
      console.log("Error dev catch sub");

      res.status(err.status || 500);
      res.render('admin/error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use("/admin", utils.isNotAuthenticatedThenLogin, function(err, req, res, next) {
    console.log("Error other catch sub");
    res.status(err.status || 500);
    res.render('admin/error', {
      message: err.message,
      error: {}
    });
  });
};


router.get('/', utils.isNotAuthenticatedThenLogin, function(req, res, next) {
  res.render('admin/dashboard');
});

router.get('/dashboard', function(req, res, next){
  res.render('admin/dashboard');
});

router.get('/login', function(req, res, next) {
  res.render('admin/login');
});

router.post('/login', function(req, res, next) {
  var name = req.app.locals.config.ADMIN_NAME;
  var password = req.app.locals.config.ADMIN_PASSWORD;

  if (req.body.admin && req.body.password && req.body.admin === name && req.body.password === password) {
    req.session.admin = {
      admin: password
    };
    console.log(req.session.admin);
    return res.redirect('/admin');
  } else {
    return res.render('admin/login', {
      page_script: 'js/admin/default',
      errors: ['admin name or password is invalid!']
    });
  }
});


router.get('/logout', utils.isNotAuthenticatedThenLogin, function(req, res, next) {
  delete req.session.admin;
  return res.redirect('/admin');
});

// catch 404 and forward to error handler
router.all("/*", function(req, res, next) {
  console.log("Error 404 catch sub");
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
