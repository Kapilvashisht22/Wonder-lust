const express=require('express');
const app=express();
const path=require('path');
var router=express.Router();
router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs');
});
module.exports=router;