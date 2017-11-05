var Showcase, mongoose, autoIncrement;

mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

Showcase = new mongoose.Schema({
  id: Number,
  title: String,
  detail: String,
  avatar: Object,
  order: {
    type: Number,
    default: -1
  },
  visible: {
    type: Boolean,
    default: false
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  last_modified_date: {
    type: Date,
    default: Date.now
  }
});

Showcase.plugin(autoIncrement.plugin, 'Showcase');

module.exports = mongoose.model('Showcase', Showcase);
