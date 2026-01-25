const User=require('../models/user.js');

module.exports.signUp=async(req,res)=>{
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
};
module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs');
};

module.exports.logIn=async(req,res)=>{  
        // user ko authenticate krne k liye middleware[ passport.authenticate()]
        req.flash("success","Welcome back to Wonderlust!");
        const redirectUrl=res.locals.redirectUrl || '/listings';
        console.log(redirectUrl);
        res.redirect(redirectUrl);   // this will com
        
};
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){ 
            return next(err);
        }
        req.flash('success',"Logged you out successfully");
        res.redirect('/listings');
    });
};

