var Event, mongoose, autoIncrement;

mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var ProductCategory = new mongoose.Schema({
  id: Number,
  name: String,
  order: {
    type: Number,
    "default": 0,
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

ProductCategory.plugin(autoIncrement.plugin, 'ProductCategory');

module.exports = mongoose.model('ProductCategory', ProductCategory);
