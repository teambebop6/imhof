module.exports.ifNoItemsInCookiesThenRedirect = function(req, res, next){
  if(!req.cookies.itemsToBuy){
    return res.redirect('/shop');
  }
  next();
}
module.exports.getCartItems = function(req, res, next){
  if(!req.cookies.itemsToBuy){
    return res.redirect('/shop');
  }
  
  var items = [];
  if(req.cookies && req.cookies.itemsToBuy){
    JSON.parse(req.cookies.itemsToBuy).forEach(function(item){
      if(item && item.itemsAmount && item._id){
        items.push(item);
      }
    });
  }

  req.items = items;
  
  next();
}
