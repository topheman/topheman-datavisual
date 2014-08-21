/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);

//setup socket.io server and attah it to the express server
var io = require('socket.io')(server);

//launch the twitter stream connexion + attach it to the socket io listeners
var socketManager = require('./logic/sockets').launch(io);

//setup routes (ad the /api/state from the socket manager as well)
require('./routes')(app,socketManager);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;