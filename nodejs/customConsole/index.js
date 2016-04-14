var glob = require( 'glob' )
    , path = require( 'path' );
var readline = require('readline');

/**
 * @constructor
 */
module.exports = function(server){
    /** @enum */
    this.logType = {
        SocketMessage:0,
        Event: 1,
        Warning: 2,
        Error: 3
    };

    function messageAdmins(type, msg){
        var sockets = server.connected_sockets;
        for (var i = 0; i < sockets.length; i++) {
            var sock = sockets[i];
            if(sock.m3_role == "admin"){

            }
        }
    }

    var cmds = [];
    // Logs from commands
    var Console = {
        log: console.log, //TODO: Log to connected admins
        info: console.info, //TODO: Log to connected admins
        warn: console.warn, //TODO: Log to connected admins
        error: console.error //TODO: Log to connected admins
    };
    // Logs from events
    this.log = console.log; //TODO: Log to file and connected admins
    this.info = console.info; //TODO: Log to file and connected admins
    this.warn = console.warn; //TODO: Log to file and connected admins
    this.error = console.error; //TODO: Log to file and connected admins
    // Imports
    cmds = cmds.concat(require('./commands/listThings.js'));

    var handleInput = function(input){
        for (var i = 0; i < cmds.length; i++) {
            var cmd = cmds[i];
            var match = input.match(cmd.pattern);
            if(match){
                cmd.action.apply(null, [{commands:cmds, console:Console, server:server}].concat(match));
                return;
            }
        }
        Console.error("Unrecognised command "+input);
    };
    var tty = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    tty.on('line', handleInput);
};
