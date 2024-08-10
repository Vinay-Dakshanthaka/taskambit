const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleConfig = require('../config/client_secret_25562083860-n3d7n949u2d9me1gn2skkptik4ktfa96.apps.googleusercontent.com.json');

passport.use(new GoogleStrategy({
    clientID: googleConfig.web.client_id,
    clientSecret: googleConfig.web.client_secret,
    callbackURL: 'http://localhost:3002/api/auth/google/callback' 
}, (accessToken, refreshToken, profile, done) => {
    // Save the user details to database
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
