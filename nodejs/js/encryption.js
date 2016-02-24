var Encryption = function(private_key, public_key){
    this.private_key = private_key;
    this.public_key = public_key;

    this.encrypt = function(data){
        return "Encrypted - "+this.private_key+" - "+data;
    };
    this.decrypt = function(data){
        return data.replace("Encrypted - "+this.public_key+" - ","");
    };
    this.sign = function(data){
        return "Signed - "+this.public_key+" - "+data;
    };
    this.verifySignature = function(data){
        return data.indexOf("Signed - "+this.public_key+" - ") === 0;
    };
};

if(typeof exports !== 'undefined'){
    module.exports = Encryption;
}
