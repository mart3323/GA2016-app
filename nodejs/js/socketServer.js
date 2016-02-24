var io_module = require('socket.io');
var events = require('events');


var Server = function(port, onMessage){
    var io = io_module.listen(port);


    // TODO: Pass client to onMessage event
    // Find a better event handling library
    this.users = [];
    this.onMessage = new events.EventEmitter();
    this.send = function(client, type, msg){
        client.emit(type, msg);
    };
    io.on('connection', function(socket){
        this.users.push(socket);
        console.log("User connected");
        socket.on("disconnect", function(){
            var index = this.users.indexOf(socket);
            if(index > -1){
                this.users.splice(index,1);
            }
            console.log("User disconnected");
        }.bind(this));
        registerListeners([socket],this.events, onMessage);
    }.bind(this));

    this.listenFor = function(events){
        this.events = events;
        registerListeners(this.users, this.events, onMessage);
    }.bind(this);


};
module.exports = Server;

function registerListeners(users, events, onMessage) {
    for (var i = 0; i < users.length; i++) {
        for (var j = 0; j < events.length; j++) {
            users[i].on(events[j], onMessage.bind(this.onMessage, users[i], events[j]));
        }
    }
};
