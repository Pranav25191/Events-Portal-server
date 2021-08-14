const express = require("express");
const app = express();
const passport = require("passport");
const loginroute = require("./routes/route");
const profileroute = require("./routes/profile");
const Editroutes = require("./routes/edit");
const teamup_route = require("./routes/teamuproutes");
const starred = require("./routes/starred");
const home = require("./routes/home");
const events = require("./routes/events");
const internship_route = require("./routes/Internshiproutes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cors = require("cors");

const keys = require("./config/keys");

// for parsing application/json
app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true }));

//for port to port communication.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//for connecting to mongodb atlas using mongoose.
mongoose
  .connect(
    // "mongodb://localhost:/web_portal",
    // `mongodb+srv://summerproject:${keys.mongodbatlas.password}@cluster0.y1pwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    `mongodb+srv://college_portal:Ddik_Uk3.iWh.J4@cluster0.of7zi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("connected with mongodb........"))
  .catch((err) => console.error("could not connect to mongo db", err));

//public folder files are used from here.
app.use(express.static("public"));

// we are sending all the responses by adding these additional headers.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.set("view engine", "ejs");

//This integrates with the passport. It is used to create a cookie (JWT) which is stored in the client's browser but not in our server.
app.use(
  cookieSession({
    maxAge: 30 * 60 * 1000,
    keys: ["abcdefghijklmopqrstuvwxyz"],
  })
);

//passport inbuilt fuctions used in login,logout gives quick access to user schema.
app.use(passport.initialize());
app.use(passport.session());

//This function ensures whether the user is authenticated or not by checking the incoming request from client.
const ensureAuth = (req, res, next) => {
  console.log("inside ensure auth");
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send("notloggedin");
  }
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    return next();
  }
};

//all teamup are routes goes through here
app.use("/teamup", teamup_route);
app.use("/edit", Editroutes);
app.use("/Profile", profileroute);
app.use("/internships", internship_route);
app.use("/starred", starred);
app.use("/home", home);
app.use("/events", events);

app.get("/", ensureGuest, (req, res) => {
  res.redirect("/login");
});

app.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});
//This is a link which displays you the page where you can select mails that is to be logged.
app.get(
  "/auth",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect: "http://localhost:3000/login",
  })
);

// app.get("/home", ensureAuth, (req, res) => {
//     let starredinternarray=[];
//     let starredeventarray=[];
//     for(let i=0;i<req.user.StarredIntern.length;i++){

//     }
// });

// app.get("/allowcors", (req, res) => {
//   res.set("Access-Control-Allow-Origin", "*");
//   res.send("hi");
// });

app.get("/checkauth", ensureAuth, (req, res) => {
  res.sendStatus(200);
});

app.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// app.get("/Teamup", ensureAuth, (req, res) => {
//   res.redirect("http://localhost:3000/Teamup");
// });

// app.get('/login/auth',passport.authenticate('google'),(req,res)=>{
//     console.log( "router user",req.user)

//     res.redirect('/home');
// })

app.get("/logout", (req, res) => {
  req.logout();
  // res.redirect("home");
  res.send("notloggedin");
});

app.get("/teamup", ensureAuth, (req, res) => {
  res.send({
    role: "sde",
    company: "amazon",
  });
});

app.get("/internship", ensureAuth, (req, res) => {
  res.send({
    role: "sde",
    company: "amazon",
  });
});

app.listen(4444, () => {
  console.log("Listening on port 4444");
});

module.exports = ensureAuth;
