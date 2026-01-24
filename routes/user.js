const express=require('express');
const path=require('path');
const router=express.Router();
const User=require('../models/user.js');
const wrapasync=require('../utils/wrapAsync.js');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware.js');
router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs');
});

router.post('/signup',wrapasync(async(req,res)=>{
    try{console.log(req.body);
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);

    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash('success',"Welcome to Wonderlust");
    res.redirect('/listings');
    });

    
    }catch(e){
        req.flash('error',"this username is already exist");
        res.redirect('/signup');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
});

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash:true
    }),
    async(req,res)=>{  
        // user ko authenticate krne k liye middleware[ passport.authenticate()]
        req.flash("success","Welcome back to Wonderlust!");
        const redirectUrl=res.locals.redirectUrl || '/listings';
        console.log(redirectUrl);
        res.redirect(redirectUrl);   // this will com
        
});
router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){ 
            return next(err);
        }
        req.flash('success',"Logged you out successfully");
        res.redirect('/listings');
    });
});

 
module.exports=router;