/**
 * Run with babel-node, example:
 *
 * orders before: [-1, 0, 0, 0, 1, 4, 5, 6, 9]
 * orders after:  [-1, 0, 0, 0, 1, 2, 3, 4, 5]
 *
 */
import mongoose from 'mongoose';
import configLib from '../../config';
import ProductCat from '../../models/product_category';


const env = process.env.NODE_ENV || 'development';
const config = configLib(env);

mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);

ProductCat.find({}).sort({ order: 1 }).exec((err, pcs) => {
  if (err) {
    console.error(err);
  } else {
    if (pcs && pcs.length > 0) {
      let order = 1;
      const pcPromise = [];
      pcs.map((pc) => {
        if (pc.order > 0) {
          pc.order = order;
          pcPromise.push(new Promise((resolve, reject) => {
            pc.save((err) => {
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
      Promise.all(pcPromise).then(() => {
        console.log('All saved!');
      })
    }
  }
});

