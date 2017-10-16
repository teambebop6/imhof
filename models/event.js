var Event, mongoose, autoIncrement;

mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

Event = new mongoose.Schema({
  id: Number,
  name: String,
  begin: {
    type: Date,
    "default": Date.now
  },
  end: {
    type: Date,
    "default": Date.now
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

Event.plugin(autoIncrement.plugin, 'Event');

module.exports = mongoose.model('Event', Event);
