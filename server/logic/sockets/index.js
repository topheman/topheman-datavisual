exports.launch = function(io){
  var sockets = {};
  io.on('connection',function(socket){
    console.log('connected');
    io.on('disconnect',function(socket){
      console.log('disconnect');
    });
  });
};