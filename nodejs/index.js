
var Keys = require("./auth_keys.js");
var GAServer = require("./Server");
var console = require("./customConsole");
// CONFIG
var PORT = 7332;

var server = new GAServer(PORT, console);
