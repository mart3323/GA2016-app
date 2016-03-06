var Encryption = function(private_key, public_key){
    this.private_key = private_key;
    this.public_key = public_key;

    this.encrypt = function(data){
        return "Encrypted - "+this.public_key+" - "+JSON.stringify(data);
    };
    this.decrypt = function(data){
        return JSON.parse(data.replace("Encrypted - "+this.public_key+" - ",""));
    };
    this.verifyChallenge = function(challenge, test){
        return test === this.sign(challenge);
    };
};

if(typeof exports !== 'undefined'){
    module.exports = Encryption;
}
