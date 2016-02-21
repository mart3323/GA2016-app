var http = require('http');

var server = http.createServer(function (request, response) {
    if(request.url == "/"){
        response.writeHead("Content-type: text/plain");
        response.write('<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>');
        response.end('<script> var socket = io(); </script>');
        console.log("Page opened");
    }
    console.log(request.url+" opened");
});
var port = 7332;
server.listen(port);


var io = require('socket.io')(server);


console.log("Server now listening on port "+port);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('msg', function(msg){
        if(msg.target == null){
            io.emit('msg', msg);
        } else {
            io.broadcast("pm", msg);
        }
    });
    socket.on('register', function(msg){
        console.log(msg.name+" registered");
        // TODO: Verify signature
        socket.m3_public_key = msg.name;
    });
    socket.on("disconnect", function(){
        console.log("a user disconnected");
    })
});
