reject_on_disconnect = require("./reject_on_disconnect.js");
var crypto = require("crypto");
var Keys = require("../auth_keys.js");
var Promise = require("promise");

module.exports = function(socket, server){
    return Promise.race([
        new Promise(function(resolve, reject){
            var challenge = crypto.randomBytes(20).toString('hex');
            socket.emit("Challenge", challenge);
            socket.on("Register", function(reply){
                var name = reply.name;
                var pass = reply.pass;

                var valid = Keys.hasOwnProperty(name) && Keys[name].pass === pass;
                socket.emit("Registered", valid);
                if(valid) {
                    socket.m3_name = name;
                    socket.m3_role = Keys[name].role;
                    resolve(socket);
                } else {
                    reject("Invalid name/pass")
                }
            });
        }),
        reject_on_disconnect(socket, server)]
    );
};