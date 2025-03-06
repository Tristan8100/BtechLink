const express = require("express");
const users = express.Router();
const {userclasscontrol} = require('../controller/usercontroller');
const passport = require('passport');

// /user
//render routes
users.get('/login', (req, res)=>{
    const errorMessage = req.flash('error');
    res.render('Sign-in', {errorMessage});
})

users.get('/create', (req, res)=>{
    res.render('Sign-up');
})

users.get('/verify', sessionemail, (req, res)=>{ //sessionemail
    res.render('Sign-upVerification');
})

users.get('/dashboard', (req, res, next)=>{
    res.render('try');
})

users.get('/forgot', (req, res, next)=>{
    res.render('ForgotPassword');
})

users.get('/forgotverify', sessionemail, (req, res, next)=>{
    res.render('ForgotpwVerification');
})

users.get('/resetpassword', sessionemail, (req, res, next)=>{
    res.render('NewPwd');
})


//api endpoint
users.post('/verify', sessionemail, userclasscontrol.verifycode)

users.get('/verify/resend', sessionemail, userclasscontrol.resend)

users.post('/create', (userclasscontrol.selectemail));

users.post('/forgot', (userclasscontrol.forgotpassfirst));

users.post('/forgotverify', (userclasscontrol.verifycodereset));

users.post('/changepass', (userclasscontrol.changepassword));


//local strategy
users.post('/login', passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/user/login?failedd',
    failureFlash: true
}));

//google auth
users.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

users.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/user/login?notttt' }), 
    (req, res) => {
        res.redirect('/user/dashboard'); // Redirect after successful login
    }
);


//logger
function sessionemail(req, res, next){
    if(req.session.email){
        next();
    } else {
        res.redirect('/user/login');
    }
}


module.exports = users;