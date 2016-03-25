function Fingers(){
    this.fingers = {};

    this.remove = function(id){
        delete this.fingers[id];
    }.bind(this);

    this.add = function(type, id){
        this.fingers[id] = {type:type};
    }.bind(this);

    this.get_finger = function(id){
        return this.fingers[id];
    }.bind(this);
    this.as_array = function(){
        var out = [];
        for(var key in this.fingers){
            if(this.fingers.hasOwnProperty(key)){
                var temp = this.fingers[key];
                temp.id=key;
                out.push(temp);
            }
        }
        return out;
    }.bind(this)
}

