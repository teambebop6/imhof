/**
 * Change the product type from object to num(ref of product cat)
 */
import mongoose from 'mongoose';
import configLib from '../../config';
import Product from '../../models/product';


const env = process.env.NODE_ENV || 'development';
const config = configLib(env);

mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);

Product.find({}).exec((err, pcs) => {
  if (err) {
    console.error(err);
  } else {
    if (pcs && pcs.length > 0) {
      const pcPromise = [];
      pcs.map((pc) => {
        if (typeof pc.type === 'object') {
          // object
          const oldType = pc.type;
          // id
          const newType = oldType._id;
          pc.type = newType;
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
        console.log(`All saved: ${pcPromise.length}`);
      })
    }
  }
});