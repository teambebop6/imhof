var Grape, mongoose, autoIncrement;

mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

Grape = new mongoose.Schema({
  id: Number,
  image: String,
  title: String,
  description: String,
  creation_date: {
    type: Date,
    "default": Date.now
  },
  last_modified_date: {
    type: Date,
    "default": Date.now
  }
});

Grape.plugin(autoIncrement.plugin, 'Grape');

module.exports = mongoose.model('Grape', Grape);
