var io_module = require("socket.io");
var Promise = require("promise");
var crypto = require("crypto");
var Encryption = require("./js/encryption");

var io = io_module.listen(7332);

io.on('connection', function(socket){
    injectDebug(socket);
    challenge_and_verify(socket)
        .then(serve);
});

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
        setTimeout(function(arguments){
            console.log("  ← "+type+" "+JSON.stringify(msg));
            temp_emit.apply(this, arguments);
        }.bind(this, arguments), Math.random()*2000);
    }.bind(socket);

}

var private_key = "-----BEGIN RSA PRIVATE KEY-----\
                MIIBOwIBAAJBAJgC6p1FA2OcaoI2kqg0pPZouWy3ehQ1KZNvhpzm+9hfQNynop1y\
                Mck1dQ4KPBMG67qvYuHitX/YB3/EMiR1c1UCAwEAAQJAbwmyVy8SSrD3HCbA+h16\
                YoQc7k0X36r1s7zDl9kiHepSPsM9ZFOJxT+YgKGk3Rn9EiP8iEdFoPXtKsfswj1g\
                AQIhAOkX7OtTE0dPGa7QV5qhxwRBQEYe2oHaGsBfUbZux2h9AiEApvMo8JOFV9z3\
                rfC5RmliVMHQO1PIIJvWh0tJSa/6hbkCIAZuMosLb6y38e1wsfoCHItxgWRt1Xlf\
                mv1To910kOvBAiEAjEniih58u3N8UZbqKafesDhZIbFqhzRM1k3GXPxauUkCIQDQ\
                lSMNQAIOItXMISpAAck5+e46rf0RGEPD8dQOqVn7Lg==\
                -----END RSA PRIVATE KEY-----";
var public_key = "-----BEGIN PUBLIC KEY-----\
                MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJgC6p1FA2OcaoI2kqg0pPZouWy3ehQ1\
                KZNvhpzm+9hfQNynop1yMck1dQ4KPBMG67qvYuHitX/YB3/EMiR1c1UCAwEAAQ==\
                -----END PUBLIC KEY-----";

var getUniqueId = function(){
    var id = 0;
    return function(){return id++;}
}();

var fingers = {};

var log = {
    received: function(msg){
        console.log(" →  "+JSON.stringify(msg));
    },
    sent: function(msg){
    }
};

function challenge_and_verify(socket){
    socket.encryption = new Encryption(private_key, public_key);

    return new Promise(function(resolve, reject){
        var challenge = crypto.randomBytes(20).toString('hex');
        socket.emit("Challenge", challenge);
        socket.on("Register", function(reply){
            var valid = false;
            try { valid = socket.encryption.decrypt(reply) == challenge; } catch (e) {}
            socket.emit("Registered", valid);
            if(valid){
                resolve(socket);
            }
        });
        reject_on_disconnect(socket, reject);
    });
}

function serve(socket){
    console.log("Began serving");
    socket.on("Finger", function(type){
        type = socket.encryption.decrypt(type);
        var id = getUniqueId();
        if(1 == type || 2 == type || 3 == type){
            var msg = {type:type, id:id};
            socket.emit("RegisterFinger", msg);
            fingers[id] = {client:socket.id, type:type};
        }
    });
    socket.on("RedactFinger", function(id){
        id = socket.encryption.decrypt(id);
        delete fingers[id];
        socket.emit("RedactedFinger", id);
    });
    return new Promise(function(resolve, reject){
        reject_on_disconnect(socket, reject);
    });
}

function reject_on_disconnect(socket, reject){
    socket.on("disconnect", function(){
        log.received("Disconnect");
        reject();
    })
}