const User = require("../models/user");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=>{
    try{
         let {username,email,password}=req.body;
    const newUser = new User({username,email});
  const registerUser = await User.register(newUser,password);
  console.log(registerUser);
  req.login(registerUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","Welcome to the WanderLust:)");
  res.redirect("/listings");
  })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
req.flash("success","Welcome to WandurLust!You are logged in :)");
//res.redirect(req.session.redirectUrl);//we use this but we use passport which refresh the req.session so redirectUrl variable was deleted so it went on undefined page  so we store this information on locals make middleware
let redirectUrl = res.locals.redirectUrl||"/listings";  //if we wan to login from the /listings web page then our isLoggedIn middleware was not trigger so it not store the path then path path was not in res.locals so it went on undefined path so we make condition if was was not find then directly login was done and goes to the /listings
res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{//this is the direct method in passport to logout the user
        if(err){//if any occur due to passport
          return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};