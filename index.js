//npm init -y
//npm install express mysql2 dotenv ejs
//npm install express-session body-parser
//npm install --save-dev nodemon
//npm install bcrypt
//npm install sequelize
//npm install passport passport-google-oauth20
//npm install passport-local

// initialize packages
const express = require('express'); // initialize express
const session = require('express-session'); // for session ID;
const passport = require('passport');
const flash = require('express-flash');

//initialize express
const app = express();

//client id: 30179596393-qjkg5kmakkdmuj4j2s4t07t8s9pqhg2o.apps.googleusercontent.com
//client secret: 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

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

//app.use(flash());
require("dotenv").config();

// Session Middleware Configuration
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

require("./middleware/passportstrat")(passport);
app.use(passport.initialize());
app.use(passport.session());
  

//routes
const userroutes = require('./routes/userroutes'); // For User
app.use('/user', userroutes);


//port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  