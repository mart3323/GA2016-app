reject_on_disconnect = require("./reject_on_disconnect.js");

module.exports = function(socket, server){
    var fingers = server.fingers;

    server.send_finger_state(socket);
    socket.on("Finger", function(type){
        fingers.add(type, "inactive", socket);
        server.updateFingers();
    });
    socket.on("RedactFinger", function(id){
        if(!fingers.contains(id)) {
            socket.emit("RedactedFinger", id);
            server.updateFingers();
        }
        if (fingers.is_owner(id, socket)) {
            fingers.remove(id);
            socket.emit("RedactedFinger", id);
            server.updateFingers();
        }
    });
    return reject_on_disconnect(socket, server);
};
