const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/userschema");
const keys = require("./keys");

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
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "http://localhost:4444/auth",
    },
    (accessToken, refreshToken, profile, done) => {
      const data = new User({
        Name: profile.displayName,
        Mail_Id: profile.emails[0].value,
        user_profile: profile.photos[0].value,
      });
      console.log("line number 32", data.Mail_Id);
      if (data.Mail_Id.slice(-13) === "@iitgoa.ac.in") {
        async function createorfind() {
          const finduser = await User.findOne({ Mail_Id: data.Mail_Id });
          // console.log("find user: ",finduser)
          if (finduser == null) {
            const result = await data.save();
            console.log("printing result", result);
            done(null, result);
          } else {
            console.log("inside else");
            done(null, finduser);
          }
        }
        createorfind();
        console.log("inside if condition");
      } else {
        done(null, false);
      }
    }
  )
);
