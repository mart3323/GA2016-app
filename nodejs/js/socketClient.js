var SocketClient = function(IP, PORT){
    var socket = io(IP+":"+PORT);

    this.isConnected = function(){ return socket.connected; };
    socket.on("registration approved",function(msg){console.log("regappr"+msg)});


    this.onConnect = $.Callbacks();
    this.onDisconnect = $.Callbacks();
    this.onMessage = $.Callbacks();

    this._onConnect = function(){
        if(!this.connected){
            this.onConnect.fire();
        }
        this.connected = true;
    }.bind(this);

    this._onDisconnect = function(){
        if(this.connected){
            this.onDisconnect.fire();
        }
        this.connected = false;
    }.bind(this);

    this.listenFor = function(events){
        for (var i = 0; i < events.length; i++) {
            socket.on(events[i], this.onMessage.fire.bind(this.onMessage, events[i]));
        }
    }.bind(this);

    socket.on("connect", this._onConnect);
    socket.on("reconnect", this._onConnect);
    socket.on("disconnect", this._onDisconnect);
    socket.on("error", this._onDisconnect);

    this.connected = false;


    this.send = function(type,message){
        socket.emit(type, message);
    };
};

if(typeof exports !== 'undefined'){
    module.exports = SocketClient;
}



