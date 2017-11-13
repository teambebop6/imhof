module.exports.ifNoItemsInCookiesThenRedirect = function(req, res, next){
  if(!req.cookies.itemsToBuy){
    return res.redirect('/shop');
  }
  next();
}

module.exports.getCartItems = function(cartCookie){
  var items = [];
  if(cartCookie){
    JSON.parse(cartCookie).forEach(function(item){
      if(item && item.itemsAmount && item._id){
        items.push(item);
      }
    });
  }
  return items;
}
