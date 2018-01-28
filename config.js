var devEnc = require('./imhof-secret/development');
var prodEnc = require('./imhof-secret/production');
var path = require('path');

var development = {
  UPLOAD_FOLDER: process.env.UPLOAD_FOLDER || path.join(process.env.HOME, '/www/uploads'),
  DB_PORT: '27017',
  DB_NAME: 'imhof',
  DEBUG_LOG: true,
  DEBUG_WARN: true,
  DEBUG_ERROR: true,
  DEBUG_CLIENT: true,
};

var production = {
  UPLOAD_FOLDER: '/usr/local/share/uploads',
  DB_PORT: '27017',
  DB_NAME: process.env.DB_NAME || 'imhof',
  DEBUG_LOG: false,
  DEBUG_WARN: false,
  DEBUG_ERROR: true,
  DEBUG_CLIENT: false,
};

var config = {
  ROOT: __dirname,
  DB_HOST: 'localhost',
  AGENDA_LIMIT: 4,
};

module.exports = function (env) {

  switch(env){
    case "development": {
      Object.assign(config, development);
      if (devEnc) {
        Object.assign(config, devEnc);
      }
      break;
    }
    case "production": {
      Object.assign(config, production);
      if (prodEnc) {
        Object.assign(config, prodEnc);
      }
      break;
    }
    default:
      console.error("Environment not found.");
  }

  console.log(config);
  return config;
};

