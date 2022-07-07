const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user.model')
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text, html) => {


        try {

            const transporter = nodemailer.createTransport({
              host: 'smtp.ethereal.email',
            
              port: 587,
              secure: false,
              auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
              },
            });
            
           
            await transporter.sendMail({
                from:  process.env.EMAIL_USERNAME,
                to: email,
                subject: subject,
                text: text,
                html:html
                // `
                // <div class= "container",
                //     style = "max-width: 90%; margin: auto; padding-top:20px"
                // >
                //     <h3>Welcome</h3>
                //     <h4>You are officially In </h4>
                //     <p style:"margin-bottom: 30px"; >Pleas enter the sign up OTP to get started</p>
                //     <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;"></h1>
                // </div>
                // `
            })
           
            console.log("email sent sucessfully");
        
          } catch (error) {
        
            console.log("email not sent");
            console.log(error);
          

    }

};

module.exports = sendEmail;