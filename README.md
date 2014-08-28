topheman-datavisual
===================

This is the repository of the [topheman-datavisual project](http://topheman-datavisual.herokuapp.com/).

You can found out more on this blog post.

##Requirements

* node
* grunt, bower
* sass
* (optional) yeoman generator-angular-fullstack - scaffolded with [yeoman generator-angular-fullstack v2.05](https://github.com/DaftMonk/generator-angular-fullstack/tree/v2.0.5)

##Install

* npm install
* bower install
* copy `server/config/local.env.default.js` to `server/config/local.env.js` and set your twitter credentials there (for dev purposes)
* grunt serve - you're good to go (more in the launch section)

##Launch

* `grunt serve` : will launch in development mocked mode (offline - no connection to twitter)
* `grunt serve:online` : will launch with a connection to twitter, using the credentials you set to open the stream to twitter.

##Deployment

To heroku :

The `grunt build` command will build the site in the `/dist` folder that will be your heroku git repo from where you'll push to deploy the site.

[Configure the Twitter credention as env variables on heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars)

Aside of the credentials, remember to set the server in production mode `heroku config:set NODE_ENV=production`

##Notes

###Apis

`/api/state` to know the state of the server (how many sockets opened / state of the twitter connexion) - easier than connecting by ssh to watch the logs. Since it's only a POC, this isn't an issue, I wouldn't advise it on a production site.