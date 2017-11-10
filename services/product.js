module.exports.getFullProductsInfo = function(items){
  return new Promise(function(resolve, reject){
    
    var ids = items.map(function(item){
      return item._id
    });

    Product.find({_id: { $in: ids}}).exec(function(err, products){
      if(err){ 
        return reject(err); 
      }
      if(!products || products.length < 1){
        reject({status: 400, message: "No products found."}); 
      }
      else{
        products.forEach(function(product){
          
          index = items.findIndex(function(obj) {
            return obj._id == product._id;
          });

          items[index].details = product;
        });

        resolve(items);
      }
    });
  });
}
