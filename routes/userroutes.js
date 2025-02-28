const express = require("express");
const users = express.Router();
const {userclasscontrol} = require('../controller/usercontroller');

// /user

//render
users.get('/login', (req, res)=>{
    res.render('Sign-in');
})

users.get('/create', (req, res)=>{
    res.render('Sign-up');
})

users.get('/verify', sessionemail, (req, res)=>{
    res.render('Sign-upVerification');
})

users.post('/create', (userclasscontrol.selectemail));

//logger
function sessionemail(req, res, next){
    if(req.session.email){
        next();
    } else {
        res.redirect('/user/login');
    }
}


module.exports = users;