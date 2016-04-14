var io_module = require("socket.io");
var Fingers = require("../js/Fingers.js").Fingers;
var serveUser = require("./serveUser.js");
var serveSpeaker = require("./serveSpeaker.js");
var serveAdmin = require("./serveAdmin.js");
var challenge_and_verify = require("./challenge_and_verify.js");

module.exports = function(PORT, Console){
    this.console = new Console(this);
    var console = this.console;
    this.fingers = new Fingers();
    this.connected_sockets = [];
    this.io = io_module.listen(PORT,{});
    console.log("Listening on: " + PORT);

    var onConnect = function(socket){
        injectDebug(socket, this);
        challenge_and_verify(socket, this)
        .then(function(socket){
            this.connected_sockets.push(socket);
            switch(socket.m3_role){
                case "LBG": return serveUser(socket, this);
                case "SPEAKER": return serveSpeaker(socket, this);
                case "ADMIN": return serveAdmin(socket, this);
                default: return false;
            }
        }.bind(this)
        ).catch(function(e){
            server.console.info("Stopped serving user for the following reason:\n"+e);
        });
    }.bind(this);

    this.io.on('connect', onConnect);
    this.io.on('reconnect', onConnect);

    this.send_finger_state = function(sock) {
        if (sock.m3_admin) {
            sock.emit("FingerUpdate", this.fingers.toJSON())
        } else {
            var isOwner = function (f) { return f.owner == sock.m3_name; };
            sock.emit("FingerUpdate", this.fingers.filter(isOwner).toJSON());
        }
    }.bind(this);

    this.updateFingers = function(){
        for (var i = 0; i < this.connected_sockets.length; i++) {
            var sock = this.connected_sockets[i];
            this.send_finger_state(sock);
        }
    }.bind(this);



    function injectDebug(socket, server) {
        server.console.log("Injecting debug");
        var temp_on = socket.on;
        socket.on = function(type, func){
            temp_on.apply(this, [type, function(msg){
                func(msg);
                server.console.log("   →  "+type+" "+JSON.stringify(msg));
            }]);
        }.bind(socket);
        var temp_emit = socket.emit;
        socket.emit = function(type,msg){
            temp_emit.apply(socket, [type, msg]);
            server.console.log("    ← "+type+" "+JSON.stringify(msg));
        }.bind(socket);
    }
};