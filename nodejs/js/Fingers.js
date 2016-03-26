function Fingers(fingers){
    var fingers = fingers || {};

    this.remove = function(id){
        delete fingers[id];
    };
    this.is_owner = function(id, owner){
        return fingers[id] && fingers[id].owner == owner.m3_name;
    };

    this.contains = function(id){
        return fingers.hasOwnProperty(id);
    };

    this.add = function(type, id, state, owner){
        fingers[id] = {type:type, state:state, owner:owner.m3_name};
    };

    this.get_finger = function(id){
        return fingers[id];
    };

    this.as_array = function(){
        var out = [];
        for(var key in fingers){
            if(fingers.hasOwnProperty(key)){
                var temp = fingers[key];
                temp.id=key;
                out.push(temp);
            }
        }
        return out;
    };

    this.filter = function(predicate){
        var new_fingers = new Fingers();
        var fingers = this.as_array();
        for (var i = 0; i < fingers.length; i++) {
            var finger = fingers[i];
            if(predicate(finger)){
                new_fingers.add(finger.type, finger.id, finger.state, finger.owner)
            }
        }
        return new_fingers;
    };
    this.toJSON = function(){
        return fingers;
    };
}
if(typeof exports != "undefined"){
    module.exports = {Fingers:Fingers};
}