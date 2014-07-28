topheman-dataviz
================

##Requirements

* node
* grunt, bower
* sass
* yeoman (optional) generator-angular-fullstack (todo : specify version)

##Install

* npm install
* bower install
* grunt init to create the server/config/local.env.js - set your twitter credentials there
* grunt serve - you're good to go

For the moment the module `twitter-stream-channels` is still in dev and not yet published on npm. Some problems with npm link on windows, so I call the module with a relative path temporarily.

##Launch

* `grunt serve` : will launch in development mocked mode (offline - no connection to twitter)
* `grunt serve:online` : will launch with a connection to twitter

##Notes

Scaffolded with [yeoman generator-angular-fullstack v2.05](https://github.com/DaftMonk/generator-angular-fullstack/tree/v2.0.5)