var keys = {
    LBG_TALLINN: {
        admin: false,
        private_key:"-----BEGIN RSA PRIVATE KEY-----\
                MIIBOwIBAAJBAJgC6p1FA2OcaoI2kqg0pPZouWy3ehQ1KZNvhpzm+9hfQNynop1y\
                Mck1dQ4KPBMG67qvYuHitX/YB3/EMiR1c1UCAwEAAQJAbwmyVy8SSrD3HCbA+h16\
                YoQc7k0X36r1s7zDl9kiHepSPsM9ZFOJxT+YgKGk3Rn9EiP8iEdFoPXtKsfswj1g\
                AQIhAOkX7OtTE0dPGa7QV5qhxwRBQEYe2oHaGsBfUbZux2h9AiEApvMo8JOFV9z3\
                rfC5RmliVMHQO1PIIJvWh0tJSa/6hbkCIAZuMosLb6y38e1wsfoCHItxgWRt1Xlf\
                mv1To910kOvBAiEAjEniih58u3N8UZbqKafesDhZIbFqhzRM1k3GXPxauUkCIQDQ\
                lSMNQAIOItXMISpAAck5+e46rf0RGEPD8dQOqVn7Lg==\
                -----END RSA PRIVATE KEY-----".split(" ").join(""),
        public_key:"-----BEGIN PUBLIC KEY-----\
                MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJgC6p1FA2OcaoI2kqg0pPZouWy3ehQ1\
                KZNvhpzm+9hfQNynop1yMck1dQ4KPBMG67qvYuHitX/YB3/EMiR1c1UCAwEAAQ==\
                -----END PUBLIC KEY-----".split(" ").join("")
    },
    SPEAKER: {
        admin:true,
        private_key: "test",
        public_key: "ificate"
    },
};

if(typeof exports != "undefined"){
    module.exports = keys;
}
