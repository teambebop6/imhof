exports.isNotAuthenticatedThenLogin = function(req, res, next) {
  if (req.session.admin) {
    console.log("Req session is set.")
      return next();
  } else {
    console.log("Req session is not set.")
      return res.render('admin/login');
  }
};

