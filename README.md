topheman-datavisual
===================

[![image](http://dev.topheman.com/wp-content/uploads/2014/08/angular-topheman-logo-medium.png)](http://topheman-datavisual.herokuapp.com/)

This is the repository of the [topheman-datavisual project](http://topheman-datavisual.herokuapp.com/), I also made a less technical presentation on [this blog post](http://dev.topheman.com/datavisualization-with-angular-and-d3-on-the-twitter-stream-api).

Summary :

* [Presentation](#presentation)
* [Instructions](#instructions)

##Presentation

The goal of this project was to mix **Angular** and **d3** - a JavaScript framework and a datavisualization library that should work very well together.

###twitter-stream-channels

Before even starting on the frontend part, I built [twitter-stream-channels](http://labs.topheman.com/twitter-stream-channels/), a node module that handles the post-processing of the tweets comming from the [Twitter Stream API](http://labs.topheman.com/twitter-stream-channels/) (I managed to include a built-in mock version of the module to work offline due to the connexion limits of Twitter).

###constraints / backend / connexions management

The Twitter Stream API has a [rate limit](https://dev.twitter.com/docs/rate-limiting/1.1). Simply put, you have 15 minutes windows : if you make too much connexions/disconnexions you'll be stall for the end of the window.

On the other hand, **the browser is not connected directly to Twitter Stream** but by websockets (through my node server, using socket.io).

As you can see, browser connects to node that connects to Twitter. So to know when to close each connexions, I made some choices :

I setup a **maxAge on the websockets** and a routine that runs every minutes to close the websockets which are too old. Once no more websockets are opened, this routine stops (so no more timers).

An other routine runs every 15 minutes to check if there are still websockets opened. If there are, it relaunches the Twitter connexion, if not, it cleanly closes it.

This way, I'm sure the connexion is always opened when browsers are connected via websockets and also, when no more people are connected, it cleanly closes the connexion with Twitter, with no more timer remaining. At that time, the node process can safely be shutdown as the VM (project hosted on heroku) ...

Possible states :

* websocket connected / Twitter Stream connected (that's when you retrieve data)
* websocket connected / Twitter Stream disconnected (possible disconnexion from twitter, attempting to reconnect)
* websocket disconnected / Twitter Stream connected (your browser has been forced to disconnect due to inactivity or is experiencing network problem but the node server is still up and connected to Twitter)
* websocket disconnected / Twitter Stream disconnected (your browser is disconnected, the node server is disconnected from Twitter because no more people on the websockets - the process can be shut down)

###frontend

Finally ! We're talking about frontend, Angular, d3 and stuff ! Yeah, when I had this project in mind, I didn't think about doing so much backend ...

I made a [service to manage the transport/persistance layer](https://github.com/topheman/topheman-datavisual/blob/master/client/app/services/persistance/persistance.service.js) that is in charge of :

* retrieving the data from the websockets
* sharing this accross the app in realtime:
	* to the [d3 directives](https://github.com/topheman/topheman-datavisual/tree/master/client/app/directives/d3)
	* to the [state/notifications directives](https://github.com/topheman/topheman-datavisual/blob/master/client/app/directives/stateNotifications/stateNotifications.directive.js)

I made four kinds of d3 directives : tree chart, pack chart, pie chart and bar chart. They are home made (this was the challenge). I made them responsive, it works, but I don't know if it is the best way (one thing to take in account is that the data is not static but dynamic and updated in realtime).

Whatever, the first thing you must understand in d3 are the enter/update/remove phases.

###next

The app can be improved. Currently, there is no persistance of the data on the backend and the app can't be scaled (the Twitter Stream is on the same process as socket.io - you can't open multiple streams on same Twitter API key).

A cool thing would be to add some MongoDB to store the tweets, Redis to share the sockets states, so there would be one process dedicated to Twitter Stream and others that could be scaled at will, in charge of managing websockets.

But one step at a time (and still, I started this project to practice Angular and d3 ;-) ) ...


##Instructions

###Requirements

* node (works on node v0.12, v4 & v5)
* grunt, bower
* sass
* (optional) yeoman generator-angular-fullstack - scaffolded with [yeoman generator-angular-fullstack v2.05](https://github.com/DaftMonk/generator-angular-fullstack/tree/v2.0.5)

###Install

* `npm install`
* `bower install`
* copy `server/config/local.env.default.js` to `server/config/local.env.js` and set your twitter credentials there (for dev purposes)
* grunt serve - you're good to go (more in the launch section)

###Launch

* `grunt serve` : will launch in development mocked mode (offline - no connection to twitter)
* `grunt serve:online` : will launch with a connection to twitter, using the credentials you set to open the stream to twitter.

###Deployment

To heroku :

The `grunt build` command will build the site in the `/dist` folder that will be your heroku git repo from where you'll push to deploy the site.

[Configure the Twitter credention as env variables on heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars)

Aside of the credentials, remember to set the server in production mode `heroku config:set NODE_ENV=production`

###Notes

####Channels

The channels are configured server-side in `server/config/channelsDescription.json`. This configuration is retrieved at the first websocket connexion between the browser and the nodejs server.

####Apis

`/api/state` to know the state of the server (how many sockets opened / state of the twitter connexion) - easier than connecting by ssh to watch the logs. Since it's only a POC, this isn't an issue, I wouldn't advise it on a production site.

####Client dependencies

This is a list of the exact versions used in bower_components (in case there was a mix up with bower). I freezed the bower.json to avoid conflicts and regressions.

`bower list`

```
topheman-datavisual
├── angular#1.2.22 (1.3.0-rc.0 available)
├─┬ angular-animate#1.2.22 (1.2.24-build.413+sha.9bf964f available, latest is 1.3.0-rc.0)
│ └── angular#1.2.22 (latest is 1.3.0-rc.0)
├─┬ angular-cookies#1.2.22 (1.3.0-rc.0 available)
│ └── angular#1.2.22
├─┬ angular-growl-v2#0.7.0
│ └── angular#1.2.22 (1.3.0-rc.0 available)
├─┬ angular-mocks#1.2.22 (1.3.0-rc.0 available)
│ └── angular#1.2.22
├─┬ angular-resource#1.2.22 (1.3.0-rc.0 available)
│ └── angular#1.2.22
├─┬ angular-route#1.2.22 (1.3.0-rc.0 available)
│ └── angular#1.2.22
├─┬ angular-sanitize#1.2.22 (1.3.0-rc.0 available)
│ └── angular#1.2.22
├─┬ angular-scenario#1.2.22 (1.3.0-rc.0 available)
│ └── angular#1.2.22
├─┬ angular-scroll#0.6.1
│ └── angular#1.2.22 (1.2.24-build.413+sha.9bf964f available, latest is 1.3.0-rc.0)
├─┬ angular-socket-io#0.6.0
│ └── angular#1.2.22 (1.2.24-build.413+sha.9bf964f available, latest is 1.3.0-rc.0)
├─┬ bootstrap#3.1.1 (latest is 3.2.0)
│ └── jquery#1.11.1 (2.1.1 available)
├── bootstrap-sass-official#3.1.1+2 (latest is 3.2.0+1)
├── d3#3.4.11
├── es5-shim#3.0.2 (latest is 4.0.3)
├── font-awesome#4.1.0 (4.2.0 available)
├── jquery#1.11.1 (latest is 2.1.1)
├── json3#3.3.2
└── lodash#2.4.1
```