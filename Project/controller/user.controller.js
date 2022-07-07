require('dotenv').config();
const {Sequelize, Op, QueryTypes, DATE} = require('sequelize')
const nodemailer = require('nodemailer');
const authJwt = require('../middleware/auth')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.config');
const User = require('../models/user.model')
const Order = require('../models/order.model')
const generateOtp = require('../helper/generateOTP')
const sendEmail = require('../helper/emailSender')




 
module.exports.signUp = async(req, res) => {


    // To add minutes to the current time
    function AddMinutesToDate(date, minutes) {
    
        console.log('Time: ', date.getHours() ,':', date.getMinutes() ,':', date.getSeconds())
        console.log(date.getTime())
    return new Date(date.getTime() + minutes * 50000);

}

  const now = new Date()
  console.log('Time: ', `${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}` , )

    User.findOne({
        where: {
                email: req.body.email
            }
        }).then( email => {
        if(email)
        {
            res.status(400).send({message: "Email is already in use!",})
        }
        else{
        
         
            User.create({
                email : req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                city: req.body.city,
                password: req.body.password,
                role:req.body.role,
                status: req.body.status,
                isVarify: req.body.isVarify,
                OTP : generateOtp(),
                expireOtpTime: AddMinutesToDate( now, 5)
               
            })
    
            .then(async(user) => {

                if (user) {
                    
                    const text = 'Email Implement sendEmail for register API using ethereal.email';
                    const subject = 'Verify OTP';
                    const html = `
                            <div class= "container",
                                style = "max-width: 90%; margin: auto; padding-top:20px"
                            >
                                <h3>Welcome</h3>
                                <h4>You are officially In </h4>
                                <p style:"margin-bottom: 30px"; >Pleas enter the sign up OTP to get started</p>
                                <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${user.OTP}</h1>
                            </div>
                            `

                    await sendEmail(user.email, subject, text, html);

                       res.status(200).send({ 
                       message: "User was registered successfully!", 
                       res:user,
                       msg:'Mail send',                                          
                     });
                } 
              })
              .catch(err => {
                res.status(500).send({ message: err.message });
                console.log(err)
              });
            

        }
    });

   
}

module.exports.verifyOtp = async(req, res, next) => {


    try{
        var currentdate = new Date(); 
      
       const otp = req.params.otp
       console.log('OTP: ', otp)
        
        if(!otp){
            return res.status(400).send({
                status:'Failed!',
                message:'OTP not provided'
            })
         
        } 
  

        const otp_instance= await User.findOne({where:{OTP: otp}})

        console.log(JSON.stringify(otp_instance, null, 4))


        console.log('isVarify: ',otp_instance.isVarify)
        console.log('OTP: ',otp_instance.OTP)

        //Check if OTP is available in the DB
        if(otp_instance.OTP != null )
        {

            console.log('OTP: ', otp_instance.OTP)

          //Check if OTP is already used or not
          if(otp_instance.isVarify !=true)
          {
            
             console.log('After varifying OTP: isVarify: : ',otp_instance.isVarify)

              //Check if OTP is expired or not
             // if (dates.compare(otp_instance.expiration_time, currentdate)==1){
    
                  //Check if OTP is equal to the OTP in the DB

                  if(otp==otp_instance.OTP){

                    
                      // Mark OTP as verified or used
                      otp_instance.isVarify=true
                      console.log("After varifying OTP: isVarify: ",otp_instance.isVarify)
                      otp_instance.save()
    
                    return res.status(200).send({
                        status:'Success',
                        message:'isVarify updated successfully..'
                    })
                      
                  }
                  else{
                    return res.status(400).send({
                        status:'Failed!',
                        message:'OTP NOT Matched..'
                    })
                      
                  }   
            //   }
            //   else{
            //       const response={"Status":"Failure","Details":"OTP Expired"}
            //       return res.status(400).send(response) 
            //   }
          }
          else{
                    return res.status(400).send({
                        status:'Failed!',
                        message:'OTP Already Used'
                    })
              
              }
          }
        else{

            return res.status(400).send({
                status:'Failed!',
                message:'Something went wrong!'
            })
            
        }
      }catch(err){

            return res.status(400).send({
                status:'Failed!',
                message:'OTP not valid',
                error: err.message
            })
         
      }

   
}

module.exports.findAll = (req, res) => {

   
    try{

        User.findAndCountAll({attributes: {exclude: ['password']}})
        .then(users => {
            if(users)
             return res.status(200).send({status:'Success',message:'Record', res:users})
             else{
                 return res.status(500).send({status:'Failed!', message:'Data not found'})
             }
        })

       
    }
    catch(err)
    {
        res.status(500).send({status:'Failed!', message:'Error ocuuring while fetching records'})
        console.log(err)
    }
   
}


module.exports.findByPk = (req, res) => {

    try{

        const id = req.params.userId
        User.findByPk(id, { attributes: {exclude: ['password']}})
        .then( (user) => {

            if(user)
            {
                return res.status(200).send({status:'Success', message:'Record found' ,res:user})
            }
            else
            {
                return res.status(500).send({status:"Failed!",message:`${id} id you entered is not valid`})
            }
        })
    }
    catch( err)
    {
        return res.status(500).send({status:"Failed!",message: 'Error occuring while fetching record', error:err})
    }

 
}

module.exports.update = async(req, res) => {


    try{
       const id = req.params.userId;
           
               await  User.update({email : req.body.email, firstName : req.body.firstName, lastName: req.body.lastName, city: req.body.city, role: req.body.role} , 
                        {where : {userId: req.params.userId}},
                       
                    ) 
                    .then( (user) => {
                       
                        if(user)
                        {
                            return res.status(200).send({status:'Success', message: 'user updated successfully with id = ' + id });
                        }
                        else
                        {
                            return res.status(500).send({status: 'Failed', message: 'User id not found'})
                        }
                             
                    })

    }
    catch( err )
    {
        res.status(500).send({status:'Failed', message:'Error occuring while updating records'})
    }

}

module.exports.updateByToken = (req, res) => {

    let token = req.headers['x-access-token'];

    if(!token){
        return res.status(403).send({message:'No token provided...'})
    }

    jwt.verify(token, process.env.secret, (err, decoded) => {
        if(err){
            console.log(err);
            return res.status(401).send({message: 'Invalid Token!'});
        }

        req.userId = decoded.id;
    })
    const id = req.userId;
    User.update({email : req.body.email, firstName : req.body.firstName, lastName: req.body.lastName, city: req.body.city ,role: req.body.role} , 
        {where : {userId: req.userId}}
        )
        .then( () => {
            res.status(200).send({ message: 'user updated successfully with id = ' + id });
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({error:true, message:err})
        });
 

}


module.exports.delete = (req, res) => {


    const id = req.params.userId;
    User.destroy({ where: {userId: id}})
    .then( (user) => {
      
        if(user)
        {
            res.status(200).send({ status : 'Success', message: 'user deleted successfully with id = ' + id });
        }
        else
        {
            res.status(401).send({status : 'Failed!',message: 'Id not found'})
        }
       
    })
    .catch(err => {
        res.status(401).send({ status : 'Failed!', message: 'Error occuring while deleting record', error:err})
    });
}

module.exports.deleteByToken = (req, res) => {

    let token = req.headers['x-access-token'];

    if(!token){
        return res.status(403).send({message:'No token provided...'})
    }

    jwt.verify(token, process.env.secret, (err, decoded) => {
        if(err){
            console.log(err);
            return res.status(401).send({message: 'Invalid Token!'});
        }

        req.userId = decoded.id;
    })
    const id = req.userId;
    User.destroy({where: {id:id}})
    .then( () => {
      
        res.status(200).send({ message: 'user deleted successfully with id = ' + id });
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({message: 'Id not found', error:err})
    });
 

}

module.exports.signIn = (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        // var token = jwt.sign({ id: user.id }, process.env.secret, {
        //   expiresIn: 86400 // 24 hours
        // });

       

          var token = jwt.sign({ userId: user.userId, email: user.email, firstName: user.firstName,

            lastName:user.lastName, role:user.role, status:user.status,isVarify: user.isVarify }, process.env.secret, {
            expiresIn: 86400 // 24 hours
          });

          res.status(200).send({
       
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName:user.lastName,   
            roles: user.role,
            status:user.status,
            isVarify: user.isVarify,
            accessToken: token
          });
       
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };

module.exports.getAllwithAuth = (req, res) => {

    try{
         User.findAndCountAll({ attributes: {exclude: ['password']}})
        
        .then( (user) => {

            res.status(200).send({ message: 'user found', res:user });
           
            })        
    }
    catch(err)
    {
        res.status(500).send({message:'Invalid token', err:err.message})
    }
   
}


 module.exports.showOnlyAdmin = async(req, res) => {

    const query = req.query;
    console.log('Searching: ', query)
    

    try{    
            const from = req.query.from;
            const to = req.query.to;


            if(req.query.from && req.query.to)
            {

                const date =  User.findAll({ where: {created_at: {
                    [Op.and]:
                        { 
                          [Op.gte]: req.query.from,
                          [Op.lte]: req.query.to 
                        }
                    }}
                })

                .then( (user) => {
                    if(user)
                    {
                        return res.status(200).json({
                            status:'Success',
                            message: `Successfully Get  User`,
                            totalUser:`Total user between date from ${from} to ${to} is: ${user.length}`,
                            User: user,
                                        
                        });  
                    }
                    else{

                        return res.status(402).send({
                                status:'Failed!',
                                message: `User not found`,
                           
                        });  
                    }
                        
                })
                .catch( (err) => {
                    console.log(err)
                     return res.status(402).send({
                            status:'Failed!',
                            message: `User not found`,
                            error:err.message
                                    
                    });  
                })

               
              
            }
            else if(req.query.from)
            {
                
                    const date =  User.findAll({ where: {created_at: {
                        [Op.and]:
                            { 
                              [Op.gte]: req.query.from,
                              [Op.lte]: new DATE()
                            }
                        }}
                    })
                    .then( (user) => {
                        
                        if(user)
                        {
                            return res.status(200).json({
                                status:'Success',
                                message: `Successfully Get  User`,
                                totalUser:`Total user between date from ${from} to ${to} is: ${user.length}`,
                                User: user,
                                            
                            });  
                        }
                    })
                                  
            }

            else if(req.query.to)
            {
                
                    const date =  User.findAll({ where: {created_at: {
                        [Op.and]:
                            { 
                             
                              [Op.lte]: req.query.to,
                            }
                        }}
                    })
                    .then( (user) => {
                        if(user)
                        {
                            return res.status(200).json({
                                status:'Success',
                                message: `Successfully Get  User`,
                                totalUser:`Total user between date from ${from} to ${to} is: ${user.length}`,
                                User: user,
                                            
                            });  
                        }
                    })
                                  
            }
      
        
        const orderes = await Order.findAndCountAll({
            attributes:{  
                  include : [
                    [Sequelize.fn('COUNT', Sequelize.col('User.userId')), 'count']
                  ],
                },
                include:  [
                    { 
                        attributes: [], 
                        model: User, 
                        
                        where : Order.userId == User.userId 
                      }
                  ], 
                group: [Sequelize.col('Order.userId')]

                
          })
          .then( async(orderes) => {
           
            const user = await User.findAll({ attributes : {exclude: ['password']}})

                if(user)
                {
                    res.status(200).send({
                        message:`Total_registered_user ${user.length}`,
                        result:user,
                        Order:`Total order count`,
                        count:orderes.count
                    })
                }
                else{
                    return res.status(402).send({
                   
                        status:'Failed!',
                        message:`User not found`,                       

                    })
                }
              
          })
    
     
    }
    catch(err)
    {
        console.log(err)
      
    }


}


module.exports.resetPasswordLink = async(req, res, next) => {

    try {
        
        const email = req.body.email
        console.log(email)

        const user = await User.findOne({where:{email: email}});
           // console.log(user)
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

       // let otp = await User.findOne({ userId: user.userId });
        

         const link = `http://localhost:5000/password/setNewPassword/${user.userId}/${user.OTP}`;

        const text = 'Email Implement sendEmail for register API using ethereal.email';
        const subject = 'Password reset';
        const html = `
                <div class= "container",
                    style = "max-width: 90%; margin: auto; padding-top:20px"
                >
                    <h3>Welcome</h3>
                    <h4>Request for reset password </h4>
                    <p style:"margin-bottom: 30px"; >Follow this link to reset your password</p>
                    <h3 style="font-size: 30px; letter-spacing: 2px; text-align:center;">${link}</h3>
                </div>
                `
                
        await sendEmail(user.email, subject,text, html);

        res.status(200).send({message:"password reset link sent to your email account"});

    } catch (error) {
        res.status(400).send({status:false, message:"Error occuring", error:error.message});;
        console.log(error);
    }
}

module.exports.setNewPassword = async(req, res, next) => {

    try{
        const user = await User.findByPk(req.params.userId);
        if (!user) return res.status(400).send({message: "invalid link or expired"});
    
        const find = await User.findOne({
            userId: user.userId,
            otp: req.params.otp,
        })

        if (!find) 
            return res.status(400).send({
                status:false,
                message: "invalid link or expired"
            });
        
    
        user.password = bcrypt.hashSync(req.body.password)//req.body.password;
           
            await user.save()
            .then( (change) => {
                return res.status(200).send({
                    status:'Success', 
                    message: `Password Successfully Reset with userId : ${user.userId} `,
                    email: `${user.email}`
                });
            })
         
    }
    catch(err)
    {
        res.status(400).send({status:false, message: "An error occured", error:err.message});
        console.log(err);
    }
 

}