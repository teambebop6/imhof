'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Change the product type from object to num(ref of product cat)
                                                                                                                                                                                                                                                                               */


var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _product = require('../../models/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development';
var config = (0, _config2.default)(env);

_mongoose2.default.connect('mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME);

_product2.default.find({}).exec(function (err, pcs) {
  if (err) {
    console.error(err);
  } else {
    if (pcs && pcs.length > 0) {
      var pcPromise = [];
      pcs.map(function (pc) {
        if (_typeof(pc.type) === 'object') {
          // object
          var oldType = pc.type;
          // id
          var newType = oldType._id;
          pc.type = newType;
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
        console.log('All saved: ' + pcPromise.length);
      });
    }
  }
});