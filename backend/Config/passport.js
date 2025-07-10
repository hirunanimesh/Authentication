// backend/config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authmodel = require('../AuthModel/authmodel'); // your model
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://authentication-production-9d92.up.railway.app/api/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const username = profile.displayName;
    const role = req.session.role  // default to student if not set

    // ✅ Debug logs
  console.log("🔁 Google OAuth callback executed");
  console.log("✅ Profile:", profile);
  console.log("🧠 AccessToken:", accessToken);
  console.log("role:", role);


    let user = await authmodel.findbyemail(email);
    if (!user) {
      user = await authmodel.signup(email, null, username, role);
    }
    return done(null, user);
  } catch (err) {
    console.error("❌ Error in Google Strategy:", err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await authmodel.findbyemail(email);
    done(null, user);
  } catch (err) {
    console.error("❌ Error during deserialization:", err);
    done(err, null);
  }
});

module.exports = passport;
