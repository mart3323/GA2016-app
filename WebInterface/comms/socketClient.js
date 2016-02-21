var SocketClient = function(IP, PORT){
    var socket = io(IP+":"+PORT);

    this.isConnected = function(){ return socket.connected; };
    this.onConnect = $.Callbacks();
    this.onDisconnect = $.Callbacks();
    this.onReceiveBroadcast = $.Callbacks();
    this.onReceiveDirectMessage = $.Callbacks();

    socket.on("connect", this.onConnect.fire);
    socket.on("reconnect", this.onConnect.fire);
    socket.on("disconnect", this.onDisconnect.fire);
    socket.on("error", this.onDisconnect.fire);

    socket.on('msg', this.onReceiveBroadcast.fire);
    socket.on("pm", this.onReceiveDirectMessage.fire);

    this.send = function(type,message){
        socket.emit(type, message);
    };
};



