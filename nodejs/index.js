var io_module = require("socket.io");
var Promise = require("promise");
var crypto = require("crypto");
var Encryption = require("./js/encryption");
var Keys = require("./auth_keys.js");
var Fingers = require("./js/Fingers.js").Fingers;
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function(line){
    try{
        var a = eval(line);
        console.log(""+a);
    } catch(e){
        console.error(e);
    }
});

var io = io_module.listen(7332);
var random_delay_max = 0;

io.on('connection', function(socket){
    injectDebug(socket);
    challenge_and_verify(socket)
        .then(serve)
    .catch(console.error);
});

function serve(socket){
    connected_sockets.push(socket);
    return socket.m3_admin
       ? serveAdmin(socket)
       : serveUser(socket);
}

function injectDebug(socket) {
    var temp_on = socket.on;
    socket.on = function(type, func){
        temp_on.apply(this, [type, function(msg){
            console.log(" →  "+type+" "+JSON.stringify(msg));
            func(msg);
        }]);
    }.bind(socket);
    var temp_emit = socket.emit;
    socket.emit = function(type,msg){
            console.log("  ← "+type+" "+JSON.stringify(msg));
            setTimeout(temp_emit.bind(this, type, msg), Math.random()* random_delay_max);
    }.bind(socket);
}

var getUniqueId = function(){
    var id = 0;
    return function(){return id++;}
}();

var fingers = new Fingers();
var connected_sockets = [];

function challenge_and_verify(socket){
    return new Promise(function(resolve, reject){
        var challenge = crypto.randomBytes(20).toString('hex');
        socket.emit("Challenge", challenge);
        socket.on("Register", function(reply){
            var name = reply.name;
            var message = reply.message;

            var valid = Keys[name] != undefined;
            socket.emit("Registered", true);
            if(valid) {
                socket.m3_name = name;
                socket.m3_admin = Keys[name].admin;
                resolve(socket);
            } else {
                socket.m3_name = name;
                socket.m3_admin = false;
                resolve(socket);
            }
        });
        reject_on_disconnect(socket, reject);
    });
}

function serveAdmin(socket){
    send_finger_state(socket);
    socket.on("ActivateFinger", function(id){
        if(fingers.get_finger(id).state != "active"){
            fingers.get_finger(id).state = "active";
        } else {
            fingers.remove(id);
        }
        updateFingers();
    });
    socket.on("ClearFingers", function(n){
        fingers = fingers.filter(function(f){return f.type != n});
        console.log("Cleared fingers of type "+n);
        updateFingers();
    });
    return reject_on_disconnect(socket);
}
function serveUser(socket){
    send_finger_state(socket);
    console.log("Serving user");
    socket.on("Finger", function(type){
        var id = getUniqueId();
        fingers.add(type, id, "inactive", socket);
        updateFingers();
    });
    socket.on("RedactFinger", function(id){
        if(!fingers.contains(id)) {
            socket.emit("RedactedFinger", id);
            updateFingers();
        }
        if (fingers.is_owner(id, socket)) {
            fingers.remove(id);
            socket.emit("RedactedFinger", id);
            updateFingers();
        }
    });
    return reject_on_disconnect(socket);
}

function reject_on_disconnect(socket){
    return new Promise(function(resolve, reject){
        socket.on("disconnect", function(){
            for (var i = 0; i < connected_sockets.length; i++) {
                if(connected_sockets[i] == socket){
                    connected_sockets = connected_sockets.splice(i, 1);
                    break;
                }
            }
            reject();
        })
    });
}

var send_finger_state = function (sock) {
    if (sock.m3_admin) {
        sock.emit("FingerUpdate", fingers.toJSON())
    } else {
        var isOwner = function (f) { return f.owner == sock.m3_name; };
        console.log("Fingering by sock name "+sock.m3_name);
        sock.emit("FingerUpdate", fingers.filter(isOwner).toJSON());

    }
};

function updateFingers(){
    for (var i = 0; i < connected_sockets.length; i++) {
        var sock = connected_sockets[i];
        send_finger_state(sock);
    }
}