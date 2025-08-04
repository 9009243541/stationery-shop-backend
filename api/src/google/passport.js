const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../src/users/model"); // ✅ Import your user model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      // callbackURL:
      //   "https://tbtdj99v-3300.inc1.devtunnels.ms/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // ✅ Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // ✅ Create new user
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "",
            avatar:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : "",
          });
        }

        return done(null, user); // Send user instead of profile
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ✅ Session handling
passport.serializeUser((user, done) => {
  done(null, user._id); // Store only user ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
