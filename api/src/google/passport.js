// // config/passport.js
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: "YOUR_GOOGLE_CLIENT_ID",
//       clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
//       callbackURL: "http://localhost:3300/auth/google/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       // 🔐 You can save the user info in DB here
//       return done(null, profile);
//     }
//   )
// );

// // serialize/deserialize for session
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// require("dotenv").config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5500/auth/google/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       // Optional: save user to DB here
//       return done(null, profile);
//     }
//   )
// );

// // Required for session handling
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });
//=============================================
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3300/auth/google/callback", // ✅ Make sure this is same in Google Console
//     },
//     function (accessToken, refreshToken, profile, done) {
//       // ✅ Save to DB here if needed
//       return done(null, profile); // For now just return profile
//     }
//   )
// );

// // ✅ Session management
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../src/users/model"); // ✅ Import your user model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "http://localhost:3300/auth/google/callback",
      callbackURL:
        "https://tbtdj99v-3300.inc1.devtunnels.ms/auth/google/callback",
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
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
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
