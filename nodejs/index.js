var socketServer = require("./js/socketServer.js");
var Server = new socketServer(7332, function(client, type, msg){
    if(type == "register"){
        console.log("A user registered → "+msg);
        client.emit("registration approved", {});
    } else {
        console.log("An unknown message was received → "+type+" → "+msg);
    }
});
Server.listenFor(["msg", "pm", "register"]);
console.log("Server started");


