reject_on_disconnect = require("./reject_on_disconnect.js");

module.exports = function(socket, server){
    socket.on("ActivateFinger", function(id){
        if(server.fingers.contains(id)){
            if(server.fingers.get_finger(id).state != "active"){
                server.fingers.get_finger(id).state = "active";
            } else {
                server.fingers.remove(id);
            }
        }
        server.updateFingers();
    });
    socket.on("ClearFingers", function(n){
        server.fingers = server.fingers.filter(function(f){return f.type != n});
        server.updateFingers();
    });
    server.send_finger_state(socket);
    return reject_on_disconnect(socket, server);
}