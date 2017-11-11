// Imhof Weine
// Author: Florian Rudin, flaudre@gmail.com

var http, path, express, app, config, port, logger, bodyParser, cookieParser, expressValidator, glob, session,
  mongoose;

express = require('express');
app = express();

// Config
port = process.env.PORT || 3000;
env = process.env.NODE_ENV || "development";
config = require('./config')(env);

// Load SMTP transporter
transporter = require('./helpers/sendmail')(config);
app.locals.smtp_transporter = transporter;

// Load modules
http = require('http');
path = require('path');
logger = require('morgan'); // logging
bodyParser = require('body-parser'); // accept post parameters
cookieParser = require('cookie-parser');

expressValidator = require('express-validator');
glob = require('glob');

session = require('express-session');
var RedisStore = require('connect-redis')(session)

var store = new RedisStore({
  host: 'localhost',
  port: 6379,
})

app.use(session({
  name: "imhof2",
  store: store,
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // ms
  }
}));

// Globals
app.set('port', port);

app.locals.config = config;

// Database
//

mongoose = require('mongoose');
db_port = (config.DB_PORT || '27017');
var db = process.env.DB_NAME || config.DB_NAME || 'imhof'
mongoose.connect('mongodb://' + (config.DB_HOST || 'localhost') + ':' + db_port + '/' + db, {
  useMongoClient: true,
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open on port ' + db_port);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

// Templating engine
var ECT = require('ect');
var ectRenderer = ECT({watch: true, root: config.ROOT + '/views', ext: '.ect'});

app.locals.ect_renderer = ectRenderer;

app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.set('views', path.join(__dirname, 'views'))


// Logger
app.use(logger('dev'));

// Cookies
app.use(cookieParser());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Validator
app.use(expressValidator([]));


// Load controllers
//app.use(function(req, res, next) {
//   if(req.url.substr(-1) == '/' && req.url.length > 1)
//       res.redirect(301, req.url.slice(0, -1));
//   else
//       next();
//});

// Serve static directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(config.UPLOAD_FOLDER));
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


var controllers = glob.sync('./routes/*.js');
console.log("Loading routes: " + JSON.stringify(controllers));

controllers.forEach(function (controller) {
  require(controller)(app);
});


// Admin controllers
require(config.ROOT + '/routes/admin/index.js')(app);


// ERROR HANDLERS
//

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// Start server
var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
