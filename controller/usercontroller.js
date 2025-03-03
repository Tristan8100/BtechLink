const {user} = require('../model');
const bcrypt = require('bcrypt'); //for hashing
const nodemailer = require("nodemailer"); //install FIRST
const { where } = require('sequelize');

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

    static async resend (req, res, next){
        try {
            const codee = Math.floor(1000 + Math.random() * 9000);
            const val = await user.update(
                { 
                    user_code: codee
                },
                {
                    where: {
                        user_email: req.session.email
                    }
                }
            );

            if(val){
                //send email
                const val3 = await userclasscontrol.sendverification(req.session.email, codee);
                if(val3){
                    return res.json({value: val3, success: true});
                }
            }
        } catch (err) {
            res.status(500).json({ error: `BAD REQ ${err} (resend)` });
        }
    }

    static async verifycode(req, res, next){
        console.log('herereeerere');
        console.log(req.body.value);
        console.log(req.session.email);
        try {
            const val = await user.findOne({
                where: {
                    user_code: req.body.value,
                    user_email: req.session.email
                }
            })

            if(val){
                const updatedAt = new Date(val.updatedAt);
                const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago

                if (updatedAt >= tenMinutesAgo) {
                    const val1 = await user.update(
                        { 
                            user_status: "ACTIVE", 
                            user_code: ""
                        },
                        {
                            where: {
                                user_code: req.body.value,
                                user_email: req.session.email
                            }
                        }
                    );

                    if(val1){
                        return res.json({value: 'Success', success: true})
                    }
                } else {
                    return res.json({value: 'code expired', success: false})
                }
            } else {
                return res.json({value: 'not found', success: false})
            }
        } catch (err) {
            res.json({value: 'errorrrrr', success: false, error: err})
        }
    }

    static async forgotpassfirst(req, res){
        try {
            const code = Math.floor(1000 + Math.random() * 9000);
            const val1 = await user.update(
                {  
                    user_code: code
                },
                {
                    where: {
                        user_email: req.body.user_email,
                        user_loggedstrat: "LOCALSTRAT",
                    }
                }
            );

            if(val1[0] > 0){
                const val3 = await userclasscontrol.forgotpass(req.body.user_email, code);
                if(val3){
                    return res.json({value: 'We Have Send You OTP on your Email!!', success: true})
                }
            } else {
                return res.json({ value: 'Email not found!', success: false });
            }
            
        } catch (err) {
            res.json({value: 'server err', success: false, error: err})
        }
    }

    static async forgotpass(email, code) {
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
                subject: "Reset Your Password",
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