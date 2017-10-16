exports.ifNoItemsInCookiesThenRedirect = function(req, res, next){
  if(!req.cookies.itemsToBuy){
    return res.redirect('/shop');
  }
  next();
}
