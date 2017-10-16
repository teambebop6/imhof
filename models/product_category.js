var Event, mongoose, autoIncrement;

mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

ProductCategory = new mongoose.Schema({
  id: Number,
  name: String,
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
