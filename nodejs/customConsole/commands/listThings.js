

module.exports = [
    {
        name: "help",
        pattern: /help(?: (.+))?/,
        description: "help [command]\nLists all commands, or the help page of a specific command",
        action: function(Technical, command, arg1){
            var console = Technical.console;
            var cmds = Technical.commands;

            if(typeof arg1 != "undefined" && arg1 != null){
                for (var i = 0; i < cmds.length; i++) {
                    var cmd = cmds[i];
                    if(cmd.name == arg1){
                        console.log(cmd.description);
                        return true;
                    }
                }
                console.warn("Command "+arg1+" not found!");
                return false;
            }
            console.log("Available commands:");
            cmds.forEach(function(cmd){ console.log(cmd.name);}.bind(this));
            return true;
        }
    },
    {
        name: "ls fingers",
        pattern: /ls fingers/,
        description: "ls fingers\nList all currently active fingers",
        action: function(Technical, command, arg1){
            var console = Technical.console;

            var fingers = Technical.server.fingers.as_array();
            if(fingers.length == 0){
                console.log("No active fingers right now");
                return;
            }
            console.log(JSON.stringify(fingers));
            for (var i = 0; i < fingers.length; i++) {
                var finger = fingers[i];
                console.log(finger.type+"\t"+finger.owner.m3_name);
            }
        }
    }
];