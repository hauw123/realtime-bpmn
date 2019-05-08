const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../../config.js');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY'; //normally store this in process.env.secret

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
    if (jwt_payload.email === "hauw@hauw") {
        return done(null, true)
    }
    return done(null, false)
})
