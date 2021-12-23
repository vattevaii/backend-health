const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID =
  "625749124682-va6gmrdp0qld77152qro557us7jr0vtj.apps.googleusercontent.com";

const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
  }),
  (accessToken, refreshToken, profile, done) => done(null, profile)
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// (accessToken, refreshToken, profile, cb) =>
//   User.findOrCreate({ googleId: profile.id }, (err, user) => cb(err, user));

// (accessToken, refreshToken, profile, done) => done(null, profile)
