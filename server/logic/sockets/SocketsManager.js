var SocketsManager = function(io, twitterStreamManager){

  var sockets = {};
  
  //handle basic socket connection / disconnection
  io.on('connection',function(socket){
    console.log('>connection from browser to socket',socket.id);
    sockets[socket.id] = {
      "time" : (new Date()).getTime(),
      "socket" : socket
    };
    socket.emit('connected', twitterStreamManager.getDescriptionChannels());
    socket.on('disconnect',function(){
      delete sockets[socket.id];
      console.log(socket.id, 'disconnect',Object.keys(sockets).length+'sockets opened');
    });
  });
  
  //launch twitter stream and relay its event to the sockets
  console.log('before launch');
  twitterStreamManager.launch(function(stream){
    stream.on('channels',function(tweet){
      io.emit('data',{text:tweet.text});
    });
  });
  
};

module.exports = SocketsManager;