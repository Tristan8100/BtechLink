const {user} = require('../model');
const bcrypt = require('bcrypt'); //for hashing
const nodemailer = require("nodemailer"); //install FIRST

class userclasscontrol {

    static async selectemail(req, res, next){
        try {
            //check if user exist
            const val = await user.findOne({ where: { user_email: req.body.user_email } })
            //if exist
            if(val){
                return res.json({value: 'User Already Exist', exist: true}); // catch in Ajax
            } else {
                //proceed to register
                let rand, val1, id; //variable
                do {
                    //generate random ID 
                    rand = Math.floor(1 + Math.random() * 999999);
                    id = "LS" + rand.toString().padStart(6, "0");
                    val1 = await user.findOne({ where: { user_ID: id } })
                    //if ID exist loop again
                } while (val1)
                    req.body.user_ID = id; //bind to req.body then on the database value
                    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
                    req.body.user_password = hashedPassword;
                    req.body.user_code = Math.floor(1000 + Math.random() * 9000);
                    const val2 = await user.create(req.body);
                    if(val2){
                        //send mail
                        const val3 = await userclasscontrol.sendverification(req.body.user_email, req.body.user_code);
                        if(val3){
                            req.session.email = req.body.user_email;
                            return res.json({value: val3, exist: false});
                        }
                    }
            }
        } catch (err) {
            res.status(500).json({ error: `BAD REQ ${err} (selectemail)` });
        }
    }


    static async sendverification(email, code) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "gtristan543@gmail.com",  // sender email
                    pass: "beyd fvmz dhdl xkcb"   // email password or App Password
                }
            });
    
            // Email details
            const mailOptions = {
                from: "gtristan543@gmail.com",
                to: email,  // recipient
                subject: "Hello from BTECHlink!",
                text: `Your Verification Code is ${code}`
            };

            await transporter.sendMail(mailOptions);
            return true;
            
        } catch (err) {
            return false;
        }
    }

}

module.exports = {userclasscontrol};