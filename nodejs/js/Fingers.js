function Fingers(json){
    var fingers = {};
    this.types = [1,2,3,"bullshit","technical","clarification","yes","no"];

    var getUniqueId = function(){
        var id = 0;
        return function(){return id++;}
    }();

    if(typeof json != "undefined"){
        fingers = json.fingers;
        unused_flags = json.unused_flags;
    }
    this.remove = function(id){
        delete fingers[id];
    };
    this.is_owner = function(id, owner){
        return fingers[id] && fingers[id].owner == owner.m3_name;
    };

    this.contains = function(id){
        return fingers.hasOwnProperty(id);
    };

    this.add = function(type, state, owner){
        var id = getUniqueId();
        fingers[id] = {type:type, state:state, owner:owner.m3_name};
        return id;
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
        var new_fingers = JSON.parse(JSON.stringify(fingers));
        var fs = this.as_array();
        for (var i = 0; i < fs.length; i++) {
            var finger = fs[i];
            if(!predicate(finger)){
                delete new_fingers[finger.id]
            }
        }
        return new Fingers({fingers:new_fingers});
    };
    this.toJSON = function(){
        return {fingers: fingers};
    };
    this.toString = function(){
        return JSON.stringify(fingers);
    };
    this.count = function(type){
        var sum = 0;
        var fingers = this.as_array();
        for (var i = 0; i < fingers.length; i++) {
            var finger = fingers[i];
            if(finger.type == type){
                sum++;
            }
        }
        return sum;
    }
}
if(typeof exports != "undefined"){
    module.exports = {Fingers:Fingers};
}