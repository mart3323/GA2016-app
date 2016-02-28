var io_module = require("socket.io");
var Promise = require("promise");
var crypto = require("crypto");

var io = io_module.listen(7332);

io.on('connection', function(socket){
    console.log("→ Connect");
    challenge_and_verify(socket)
        .then(serve)
}.bind(this));

var getUniqueId = function(){
    var id = 0;
    return function(){return id++;}
}();

function challenge_and_verify(socket){
    return new Promise(function(resolve, reject){
        console.log("← Challenge");
        socket.emit("Challenge", crypto.randomBytes(20).toString('hex'));
        socket.on("Register", function(msg){
            console.log("→ Register");
            console.log("← Registered");
            socket.emit("Registered", true);
            socket.emit("Registered", false);
            resolve(socket);
        });
        reject_on_disconnect(socket, reject);
    });
}
function serve(socket){
    console.log("Began serving");
    var fingers = {};
    socket.on("Finger", function(type){
        console.log("→ Finger "+type);
        var id = getUniqueId();
        if(1 == type) {
            socket.emit("RegisterFinger", {type:1, id:id});
            fingers[id] = {client:socket.id, type:1};
        } else if(2 == type) {
            socket.emit("RegisterFinger", {type:2, id:id});
            fingers[id] = {client:socket.id, type:2};
        } else if(3 == type) {
            socket.emit("RegisterFinger", {type:3, id:id});
            fingers[id] = {client:socket.id, type:3};
        }
        console.log(JSON.stringify(fingers));
    });
    socket.on("RedactFinger", function(id){
        delete fingers[id];
        socket.emit("Redacted Finger", id);
        console.log("Redacted finger id: "+id)
    });
    return new Promise(function(resolve, reject){
        reject_on_disconnect(socket, reject);
    });
}

function reject_on_disconnect(socket, reject){
    socket.on("disconnect", function(){
        console.log("→ Disconnect");
        reject();
    })
}