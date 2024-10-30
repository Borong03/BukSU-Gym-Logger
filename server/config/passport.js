const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  // configure the google OAuth
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // google client ID from .env
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from .env
        callbackURL: "/auth/google/callback", // callback URL after google auth
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        // check if email domain is frm buksu
        if (!/@(student\.)?buksu\.edu\.ph$/.test(email)) {
          return done(null, false, { message: "Unauthorized email domain" });
        }

        try {
          // check if the user already exists in the database
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user); // user exists
          } else {
            // create a new user if not found
            const newUser = new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: email,
            });
            user = await newUser.save(); // save the new user to the database
            done(null, user); // Return
          }
        } catch (error) {
          done(error, false); // handle any errors
        }
      }
    )
  );

  // serialize the user ID to save in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // deserialize the user by ID from the session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
