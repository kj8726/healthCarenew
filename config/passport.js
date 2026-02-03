const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣ Try finding user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        // 2️⃣ If not found, try finding by email
        if (!user) {
          user = await User.findOne({ email });

          // Attach Google ID if user exists
          if (user && !user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        // 3️⃣ If still not found, create new user
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


