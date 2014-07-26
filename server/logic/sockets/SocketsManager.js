var socketMaxAge = require('../../config/environment').socketMaxAge;
var cleanSocketsDelay = require('../../config/environment').cleanSocketsDelay;

var SocketsManager = function(io, twitterStreamManager){

  var sockets = {};
  var twitterStreamRunning = false;//if true a stream to twitter is either connected or connecting
  var launchStreamRunning = false;//if true the launching routine is running (not to launch it it parallel)
  var cleanSocketsTimer = null;
  
  //handle basic socket connection / disconnection
  io.on('connection',function(socket){
    //if no cleanning sockets routine is runnng - launch one
    if(cleanSocketsTimer === null){
      cleanSockets();
    }
    //if the twitter stream was stopped but the thread not killed, reopen a stream if someone reconnects via websockets
    if(twitterStreamRunning === false && launchStreamRunning === false){
      launchStream();
    }
    console.log('>connection from browser to socket',socket.id+' '+(new Date()));
    sockets[socket.id] = {
      "time" : (new Date()).getTime(),
      "socket" : socket
    };
    socket.emit('connected', twitterStreamManager.getDescriptionChannels());
    socket.on('disconnect',function(){
      delete sockets[socket.id];
      console.log('>sockets','disconnect',socket.id,Object.keys(sockets).length+' sockets still opened'+' '+(new Date()));
    });
  });
  
  function manageEventsBetweenTwitterAndSockets(stream){
    stream.on('channels',function(tweet){
      io.emit('data',{text:tweet.text});
    });
  };
  
  /**
   * Loops through the sockets to check their activity,
   * if they've been opened for more than socketMaxAge ms,
   * emits to the front an event 
   */
  var cleanSockets = function(){
    console.log('>calling cleanSockets');
    if(Object.keys(sockets).length > 0){
      var time = (new Date()).getTime();
      for(var socketId in sockets){
        if(sockets[socketId].time + socketMaxAge < time){
          console.log('>socket '+socketId+' inactive for '+(time - sockets[socketId].time)+'ms - disconnecting it'+' '+(new Date()));
          sockets[socketId].socket.emit('inactive-socket',{msg:"You have been inactive for "+(time - sockets[socketId].time)+"ms, you have been disconnected, please refresh your page."});
        }
      }
      cleanSocketsTimer = setTimeout(cleanSockets,cleanSocketsDelay);
    }
    else{
      console.log('>no sockets to clean');
      cleanSocketsTimer = null;
    }
  };
  
  /**
   * Manages the start and stop of the Twitter stream
   * - stops it after 15min, then restarts it if there are still sockets opened
   * - adds the events from the twitter stream to the socket
   */
  var launchStream = function(){
    console.log('>calling launchStream');
    launchStreamRunning = true;
    twitterStreamManager.launch(function(stream){
      twitterStreamRunning = true;
      manageEventsBetweenTwitterAndSockets(stream);
      launchStreamRunning = false;
    },function(stream){
      console.log('stopping stream after timeout');
      stream.stop();//stop the stream at timeout
      twitterStreamRunning = false;
      if(Object.keys(sockets).length !== 0){
        console.log('>relaunching stream after timeout ('+Object.keys(sockets).length+' sockets still opened)');
        launchStream();//relaunch if there is still people
      }
      else{
        console.log('>NOT relaunching stream after timeout ('+Object.keys(sockets).length+' socket still opened)');
      }
    });
    
    if(twitterStreamRunning === false && launchStreamRunning === false){
      launchStream();
    }
    
  }
  
};

module.exports = SocketsManager;