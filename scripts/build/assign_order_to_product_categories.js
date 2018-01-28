'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _product_category = require('../../models/product_category');

var _product_category2 = _interopRequireDefault(_product_category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development'; /**
                                                  * Run with babel-node
                                                  */

var config = (0, _config2.default)(env);

_mongoose2.default.connect('mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME);

_product_category2.default.find({}).sort({ name: 1 }).exec(function (err, pcs) {
  if (err) {
    console.error(err);
  } else {
    if (pcs && pcs.length > 0) {
      var order = 1;
      var pcPromise = [];
      pcs.map(function (pc) {
        if (pc.name || pc.name === '') {
          if (pc.name && pc.name !== '') {
            pc.order = order;
            order += 1;
          } else if (pc.name === '') {
            // the non-cat (name='')'s order is -1
            pc.order = -1;
          }
          pcPromise.push(new Promise(function (resolve, reject) {
            pc.save(function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }));
        }
      });
      Promise.all(pcPromise).then(function () {
        console.log('All saved!');
      });
    }
  }
});