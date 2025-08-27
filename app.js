if (process.env.NODE_ENV != "production") {//when we deploy this project create a new envirnonment name NODE_ENV then if our process is in development phase then config dotenv otherwise in production phase we not config dotenv
  require('dotenv').config();//it integrated the backend with .env file
  //console.log(process.env.SECRET);// remove this after you've confirmed it is working//in this we want to print only SECRET credentials
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//used to create templates/layouts which want to same for all pages like navbar or footer
const ExpressError = require("./utilis/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;

main().then(res => {
  console.log("connection started");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
})

store.on("error",()=>{
  console.log("ERROR in mongo session store",err);
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,//expire till now to after 7 days//it written in millisecond
    maxAge: 7 * 24 * 60 * 60 * 1000,// 7 days
    httpOnly: true
  },
};


app.use(session(sessionOption));
app.use(flash());//phle flash use hoga then routes 

app.use(passport.initialize());//for each request passport was initialize  //Without this, Passport won’t know it should run for incoming requests.It basically sets up Passport middleware
app.use(passport.session());//application ko pta hon chaiye ki if we move from one page to another then the request was send by same user or differt user  we want one user is assoiciated with one session    //his is used when you want persistent login sessions.When a user logs in, Passport will create a session (using cookies + express-session).With this, if the user refreshes the page or navigates to another route, Passport can check if they’re still logged in
passport.use(new LocalStrategy(User.authenticate()));//user are authenticate means user must be register or sign in   //You’re telling Passport to use the Local Strategy (username + password login).User.authenticate() comes from passport-local-mongoose (if you’re using it). It automatically adds an authentication method to your User model.
passport.serializeUser(User.serializeUser());//store the information related to user in session  //After login succeeds, Passport needs to store something in the session to identify the user.This function decides what data about the user should be stored in the session cookie.
passport.deserializeUser(User.deserializeUser());//remove the inforation realted to user in session  //opposite of serializeUser.

app.use((req, res, next) => {//or esko routes se phle he likhna hai
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;//in navbar for creating login or logout button we use req.user but it is not possible to acess req so we store this is local variable and use them //currUser means jis bhi user ka session chl rha hai usse related hai
  next();
})

//create Demo User for trail
// app.get("/demouser",async(req,res)=>{
//  //create fake user for trial
//  let fakeUser = new User({
//   email:"student@gmail.com",
//   username:"latisha"
//  })
//  let registerUser = await User.register(fakeUser,"hello");//it use register(user,password,callback) it register a new user with assoiciated password  also check register method is unique
//  res.send(registerUser)
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



//testing the workin or not
// app.get("/testListing",async(req,res)=>{
//    let sampleListing = new Listing({
//     title:"My new Villa",
//     discription:"By the beach",
//     price:1200,
//     location:"Goa",
//     country:"India"
//    })
//   await sampleListing.save();
//   res.send("tested");
// })

// app.get("/",(req,res)=>{
//     res.send("working");
// })


//in this on place of "/" use "*" but server crashed why? so i used "/"
app.all("/", (req, res, next) => {//when get on different path then it give error //
  next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "ERROR OCCURED" } = err;
  //   res.render("listings/error.ejs",{err});
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
})



app.listen(8080, () => {
  console.log("server started");
})