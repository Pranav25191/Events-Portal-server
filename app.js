const express=require('express');
const app=express();
const passport=require('passport')
const loginroute= require('./routes/route');
const passportSetup=require('./config/passport-setup')
const mongoose=require('mongoose')
const cookieSession = require('cookie-session')
const cors=require('cors');
app.use(cors({
    origin: "http://localhost:3000",credentials:true
}));
mongoose.connect('mongodb://localhost/userdata',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() => console.log('connecting with mongodb........'))
.catch(err => console.error('could not connect to mongo db',err))
app.use(express.static('public'));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const funcb = (req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
}

app.set('view engine','ejs');
app.use(express.static('public'));



app.use(cookieSession({
    maxAge:60*1000,
    keys:["abcdefghijklmopqrstuvwxyz"]
}))



app.use(passport.initialize());
app.use(passport.session());

const ensureAuth = (req, res, next)=> { 
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/')
    }
}

const ensureGuest= (req, res, next) =>{ 
    if (req.isAuthenticated()) {
        res.redirect('/home')
    } else {
        return next()
    }
}

app.get('/',ensureGuest,(req,res)=>{
    res.redirect('/login')
})


app.get('/login',ensureGuest,(req,res)=>{
    res.render('login');
})


// app.get('/auth',passport.authenticate('google' ,{
//         successRedirect:'/home',
//         failureRdirect:'/login',
//         session: false
//     }
// )); 

app.get(
    "/auth",
    passport.authenticate("google", {
      successRedirect: "/home",
      failureRedirect: "/login"
    })
  );






app.get('/home',ensureAuth,(req,res)=>{
    console.log("req is:",req.user)
    res.render('index',{name:req.user.Name});
})

app.get('/allowcors',(req,res)=>{
    res.set("Access-Control-Allow-Origin", "*");
    res.send("hi");
})


app.get('/login/google',passport.authenticate('google',{scope:['profile','email']}));




// app.get('/login/auth',passport.authenticate('google'),(req,res)=>{
//     console.log( "router user",req.user)
    
//     res.redirect('/home');
// })


app.listen(4444,()=>{
    console.log("Listening on port 4444");
})

