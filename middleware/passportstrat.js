const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs'); 
//const {userclasscontrol} = require('../controller/usercontroller');
const {user} = require('../model');
const { where } = require('sequelize');

module.exports = function (passport) {
    // Local Strategy
    passport.use(
        new LocalStrategy({ usernameField: "user_email", passwordField: 'user_password', }, async (email, password, done) => {
            //
            try {
                const userdata = await user.findOne({where: {user_email: email, user_loggedstrat: 'LOCALSTRAT'}});
                
                if (!userdata) return done(null, false, { message: "User not found" });

                const isMatch = await bcrypt.compare(password, userdata.user_password);
                if (!isMatch) return done(null, false, { message: "Incorrect password" });

                return done(null, userdata);
            } catch (err) {
                return done(err);
            }
        })
    );

    // Google Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let userdata3 = await user.findOne({where: { user_ID: profile.id }});

                    if (!userdata3) { //if no user register
                        userdata3 = await user.findOne({where: { user_email: profile.emails[0].value }}); //find by email (to determine in localstrat)
                        if(!userdata3){
                            userdata3 = await user.create({ //reuse the variable to use both register and login
                                user_ID: profile.id,
                                user_firstname: profile.name.givenName,
                                user_lastname: profile.name.familyName || "", // Handle missing last names
                                user_password: "",
                                user_email: profile.emails[0].value,
                                user_status: 'ACTIVE',
                                user_loggedstrat: 'GOOGLE' // Correct enum value
                            });
                        } else if(userdata3) {
                            console.log("Email Already In Use - Blocking Google Login");
                            return done(null, false, { message: "Email Already In Use" });
                        }
                    }

                    return done(null, userdata3); //log in
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((userdata, done) => {
        done(null, userdata.user_ID);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const userdata2 = await user.findOne({where: {user_ID: id}});
            done(null, userdata2);
        } catch (err) {
            done(err);
        }
    });
};