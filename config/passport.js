const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = function(passport) {
    // initialize passport middleware
    passport.use(
        // setting the user.username to the user's email
        new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
            try {
                const user = await User.findOne({email: email})
                if(!user) {
                    return done(null, false, new Error('User not found'))
                }
                if(user.password !== password) {
                    return done(null, false, new Error('Passwords do not match'))
                }
                return done(null, user)
            } catch (error) {
                console.error(error)
            }
        })
    )
    // serializers work to attach the user's id to a cookie
    // that the browser uses to grant permissions, &c
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}