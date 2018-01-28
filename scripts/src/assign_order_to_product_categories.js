/**
 * Run with babel-node
 */
import mongoose from 'mongoose';
import configLib from '../../config';
import ProductCat from '../../models/product_category';


const env = process.env.NODE_ENV || 'development';
const config = configLib(env);

mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);

ProductCat.find({}).sort({ name: 1 }).exec((err, pcs) => {
  if (err) {
    console.error(err);
  } else {
    if (pcs && pcs.length > 0) {
      let order = 1;
      const pcPromise = [];
      pcs.map((pc) => {
        if (pc.name || pc.name === '') {
          if (pc.name && pc.name !== '') {
            pc.order = order;
            order += 1;
          } else if (pc.name === '') {
            // the non-cat (name='')'s order is -1
            pc.order = -1;
          }
          pcPromise.push(new Promise((resolve, reject) => {
            pc.save((err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }));
        }
      });
      Promise.all(pcPromise).then(() => {
        console.log('All saved!');
      })
    }
  }
});

