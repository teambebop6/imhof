var mongoose = require('mongoose');

module.exports = mongoose.model('Items', {
	itemNumber: Number,
	html_id: String,
	name: String,
	price: String,
	volume: String,
	img_thumbnail: String,
	img_full: String,
  	description: String,
	visible: Boolean,
	product_type: String,
});
