'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _product_category = require('../../models/product_category');

var _product_category2 = _interopRequireDefault(_product_category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development'; /**
                                                  * Run with babel-node, example:
                                                  *
                                                  * orders before: [-1, 0, 0, 0, 1, 4, 5, 6, 9]
                                                  * orders after:  [-1, 0, 0, 0, 1, 2, 3, 4, 5]
                                                  *
                                                  */

var config = (0, _config2.default)(env);

_mongoose2.default.connect('mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME);

_product_category2.default.find({}).sort({ order: 1 }).exec(function (err, pcs) {
  if (err) {
    console.error(err);
  } else {
    if (pcs && pcs.length > 0) {
      var order = 1;
      var pcPromise = [];
      pcs.map(function (pc) {
        if (pc.order > 0) {
          pc.order = order;
          pcPromise.push(new Promise(function (resolve, reject) {
            pc.save(function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }));
          order += 1;
        }
      });
      Promise.all(pcPromise).then(function () {
        console.log('All saved!');
      });
    }
  }
});