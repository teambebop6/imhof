var Citation, mongoose, autoIncrement;

mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

Citation = new mongoose.Schema({
  id: Number,
  words: String,
  author: String,
});

Citation.plugin(autoIncrement.plugin, 'Citation');

module.exports = mongoose.model('Citation', Citation);
