function Fingers(json){
    var fingers = {};
    var unused_flags = {
        active: 1,
        queue: 100,
    };
    if(typeof json != "undefined"){
        fingers = json.fingers;
        unused_flags = json.unused_flags;
    }
    this.active = undefined;
    this.setFlag = function(id, name){
        var finger = fingers[id];
        if(finger.flag != null){
            unused_flags[finger.flag]++;
            finger.flag = null;
        }
        if(unused_flags[name] > 0){
            unused_flags[name]--;
            finger.flags = name;
        }
    };
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
        fingers[id] = {type:type, state:state, owner:owner.m3_name, flag:null};
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
        var new_fingers = fingers;
        var fs = this.as_array();
        for (var i = 0; i < fs.length; i++) {
            var finger = fs[i];
            if(!predicate(finger)){
                delete new_fingers[finger.id]
            }
        }
        return new Fingers({fingers:new_fingers, unused_flags: unused_flags});
    };
    this.toJSON = function(){
        return {fingers: fingers, unused_flags: unused_flags};
    };
}
if(typeof exports != "undefined"){
    module.exports = {Fingers:Fingers};
}