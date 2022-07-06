const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {


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
            })
           
            console.log("email sent sucessfully");
        
          } catch (error) {
        
            console.log("email not sent");
            console.log(error);
          

    }

};

module.exports = sendEmail;