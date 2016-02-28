var ApplicationServer = require("./js/Protocol layer/ServerProtocol.js");

//var Server = new ApplicationServer(7332,[]);
var io_module = require("socket.io");
var Promise = require("promise");

var io = io_module.listen(7332);

io.on('connection', function(socket){
    console.log("→ Connect");
    challenge_and_verify(socket)
        .then(serve)
}.bind(this));

function challenge_and_verify(socket){
    return new Promise(function(resolve, reject){
        console.log("← Challenge");
        socket.emit("Challenge", "test");
        socket.on("Register", function(){
            console.log("→ Register");
            console.log("← Registered");
            socket.emit("Registered", true);
            resolve();
        });
        reject_on_disconnect(socket, reject);
    });
}
function serve(socket){
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