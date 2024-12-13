const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile);

        // Find existing user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If no Google ID match, check email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            console.log(
              "Google profile matches existing email. Updating user."
            );
            user.googleId = profile.id;
            await user.save();
          } else {
            console.log("Creating new user from Google profile.");
            user = new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              password: "", // Google users don’t require passwords
              isActive: false, // Default to inactive for admin approval
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Error during Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
