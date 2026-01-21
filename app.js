const express = require('express');    
const app = express();
const mongoose = require('mongoose');
const MONGO_URL ='mongodb://127.0.0.1:27017/wonderlust';
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate =require("ejs-mate");
const Review = require('./models/review.js');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');
const cookieParser = require('cookie-parser');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter= require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodOverride('_method')); 
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'views','public')));

app.use(cookieParser())

const sessionOptions={
    secret:"mysecret",
    resave:false,
    saveUninitialized:true, 

};
app.use(session(sessionOptions));
main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main (){
    await mongoose.connect(MONGO_URL);
}

// app.get("/getCookies",(req,res) =>{
//     res.cookie("greet","Hello from the other side");
//     res.cookie("name","Wonderlust");
//     res.send("Hello cookies sent");
// });

// app.get("/greet",(req,res)=>{
//     const{Name="Raghav"}=req.cookies;
//     res.send(`Hello ${Name}`);
// })

app.get("/", (req,res) =>{
    res.send("Hi, I am root");
    console.log(req.cookies);
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    console.log(res.locals.success);
    next();
});

//pbkdf2 hashing algorithm is used

// app.get("/demouser",async (req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"student123"
//     });
//     //in register method we pass register(user,password,callback)
//     //convenience method to register a new user instance with a given password.
//     let registeredUser= await User.register(fakeUser,"Ram@#123");
//     res.send(registeredUser);
// })


app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use("/",userRouter);

// The order of routes is the problem.

// When you visit /listings/new, Express checks routes in order.

// It first matches /listings/:id because :id = "new".

// That means id = "new" gets passed to findById("new").

// Mongoose tries to cast "new" into an ObjectId → fails → CastError.

// //New route
// app.get("/listings/new",(req,res)=> {
//     res.render("listing/new")
// });

//create post /listings route



// app.get("/testListing",async(req,res) =>{
//     let sampleListing =new Listing({
//         title:"My Home",
//         description:"A cozy place to stay",
//         price:1200,
//         location:"calangute, Goa",
//         country:"India",
//         image:" ",
//     });
//         await sampleListing.save();
//         console.log("sample was saved");
//         res.send("Successfull testing");
// });

app.use((req,res,next) =>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next) =>{
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).send(message);
}); 


app.listen(8080,() =>{
    console.log("Server is running on port 8080");
});