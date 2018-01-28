var Event, mongoose, autoIncrement, ProductCat, Product;

mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

ProductCat = require('./product_category').schema;

Product = new mongoose.Schema({
  id: Number,
  price: Number,
  avatar: Object,
  titlePicture: Number,
  title: String,
  description: String,
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    ref: 'ProductCat',
  },
  creation_date: {
    type: Date,
    "default": Date.now
  },
  last_modified_date: {
    type: Date,
    "default": Date.now
  }
});

Product.plugin(autoIncrement.plugin, 'Product');

Product.statics.findByCat = function (args) {

  return this.aggregate([
    {
      "$match": args ? args : {}
    },
    {
      "$lookup": {
        "from" : "productcategories",
        "localField" : "type",
        "foreignField" : "_id",
        "as" : "type"
      }
    },
    {
      "$unwind": {
        path : "$type",
      }
    },
    {
      "$group": {
        "_id": "$type.name",
        "catId": {
          $first: "$type._id",
        },
        "order": {
          $first: "$type.order",
        },
        "items": {$push: "$$ROOT"}
      }
    },
    {
      "$sort": {
        order: -1,
      }
    }
  ]);
};
// Product.statics.findByCat = function (args) {
//
//   return this.aggregate([
//     {
//       "$match": args ? args : {}
//     },
//     {
//       "$group": {
//         "_id": "$type.name",
//         "catId": {
//           $first: "$type._id",
//         },
//         "order": {
//           $first: "$type.order",
//         },
//         "items": {$push: "$$ROOT"}
//       }
//     },
//     {
//       "$sort": {
//         order: -1,
//       }
//     }
//   ]);
// };

module.exports = mongoose.model('Product', Product);
