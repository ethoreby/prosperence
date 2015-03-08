/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./server/config/environment/index');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./server/config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./server/config/express')(app);
require('./server/routes')(app);

// Start server
if(process.env.NODE_ENV === 'production') {
  server.listen(80, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
} else if(process.env.NODE_ENV === 'development') {
  server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

// Expose app
exports = module.exports = app;
