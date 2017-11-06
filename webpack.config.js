var webpack;

webpack = require('webpack');


var env = process.env.NODE_ENV || "development";
console.log("Node env is: " + env);

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'jquery': path.join(__dirname, '/node_modules/jquery/dist/jquery.js'),
      'jquery.validate': path.join(__dirname, '/assets/vendor/jquery.validate.min.js'),
      'jquery.validate.de': path.join(__dirname, '/assets/vendor/jquery.validate.de.js'),
      'cookies': path.join(__dirname, '/assets/js/js.cookie'),
      'lightbox': path.join(__dirname, '/bower_components/lightbox2/dist/js/lightbox.min.js'),
      'jquery.datepicker': path.join(__dirname, '/assets/vendor/jquery.datepicker/datepicker.min.js')
    }
  },
  entry: {
    default: './assets/default',
    about: './assets/about',
    contact: './assets/contact',
    shop: './assets/shop',
    cart: './assets/cart',
    buy: './assets/buy',
    'admin/index': './assets/admin/index'
  },
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: "[name].bundle.js",
    publicPath: "/",
    chunkFilename: "[id].chunk.js"
  },
  module: {
    rules: [
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    },
    {test:/\.gif$/,loader:'url-loader'},
    {test:/\.png$/,loader:'url-loader'},
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!less-loader'
      }),
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!less-loader'
      }),
    },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].css",
    }),
    new webpack.optimize.CommonsChunkPlugin({
      filename: "admin/commons.js",
      name: "admin/commons",
      chunks: ['admin/index'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      filename: "commons.js",
      name: "commons",
      chunks: ['default', 'about', 'contact', 'shop', 'cart', 'buy'],
    })
  ]
};
