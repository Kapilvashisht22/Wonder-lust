const express=require('express');
const path=require('path');
const router=express.Router();
const User=require('../models/user.js');
const wrapasync=require('../utils/wrapAsync.js');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const { signUp ,logIn,logout,renderLoginForm} = require('../controllers/users.js');
router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs');
});

router.post('/signup',wrapasync(signUp));

router.get('/login',renderLoginForm);

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash:true
    }),logIn
    );
router.get('/logout',logout);

 
module.exports=router;