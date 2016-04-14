var Promise = require("promise");

module.exports = function(socket, server){
    var console = server.console;
    return new Promise(function(resolve, reject){
        socket.on("disconnect", function(){
            for (var i = 0; i < server.connected_sockets.length; i++) {
                if(server.connected_sockets[i] == socket){
                    server.connected_sockets.splice(i, 1);
                    break;
                }
            }
            reject("user "+socket.m3_name+" disconnected");
        })
    });
}