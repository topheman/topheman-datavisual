/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app, socketManager) {

  // Returns the state of the socket and twitter connexions
  app.get('/api/state', function(req,res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(socketManager.getState()));
  });
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
