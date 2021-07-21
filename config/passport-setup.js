const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/userschema");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "261769876817-qr2ieeabru04bnne63hgbvg32sfehmdj.apps.googleusercontent.com",
      clientSecret: "zkrrsjugp2DJBS6zpMexttUQ",
      callbackURL: "http://localhost:4444/auth",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      // console.log(profile.photos[0].value)
      const data = new User({
        Name: profile.displayName,
        Mail_Id: profile.emails[0].value,
        user_profile: profile.photos[0].value,
      });
      if(data.Mail_Id.slice(-13)==="@iitgoa.ac.in"){
        async function createorfind() {
            const finduser = await User.findOne({ Mail_id: data.Mail_id });
            if (finduser == null) {
            const result = await data.save();
            done(null, result);
            } else {
            done(null, finduser);
            }
        }
        createorfind();
        }
      else{
            done(null, false);
      }
    }
  )
);
