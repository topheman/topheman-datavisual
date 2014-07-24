var SocketsManager = function(io, twitterStreamManager){

  this.io = io;
  this.twitterStreamManager = twitterStreamManager;
  this.sockets = {};
  
  var that = this;
  
  io.on('connection',function(socket){
    console.log('>connection from browser to socket',socket.id);
    that.sockets[socket.id] = {
      "time" : (new Date()).getTime(),
      "socket" : socket
    };
    socket.emit('connected', that.twitterStreamManager.getDescriptionChannels());
    socket.on('disconnect',function(){
      delete that.sockets[socket.id];
      console.log(socket.id, 'disconnect',Object.keys(that.sockets).length+'sockets opened');
    });
  });
  
};

module.exports = SocketsManager;