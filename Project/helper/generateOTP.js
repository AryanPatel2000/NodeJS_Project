require('dotenv').config();


generateOtp = (req, res, next) => {

    const digits = '0123456789';
    let otp = '';


    for(let i = 0; i < 4 ; i++)
    {
        otp = otp + digits[Math.floor(Math.random()* digits.length)];
    }
    console.log('OTP is: ',otp);
   
    return otp

 
  
}


generateOtp();



module.exports = generateOtp;