require('dotenv').config();
const db = require('../config/db.config')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const User = require('../models/user.model') 
const Order = require('../models/order.model')

const Role = require('../models/role.model')
const {Sequelize} = require('sequelize')
const  userController = require('../controller/user.controller')


verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
 //   console.log('Token: ',token)

    if(!token){
        return res.status(403).send({error:true,message:'No token provided...'})
    }

    jwt.verify(token, process.env.secret, (err, decoded) => {
        if(err){
            console.log(err);
            return res.status(401).send({message: 'Invalid Token!'});
        }

        req.userId = decoded.id;
        next();
    })
}

  checkRoles = async(req, res, next) => {
     
      const userId =  req.user
      
      var userDetails = await User.findOne({ where: { userId: userId } })
  
      console.log(userDetails)

      if(req.user.role === 'Admin' || req.user.role === 'Manufacturer')
      {
           next();
      }
      else{

        return res.status(401).send({status:'Failed!',message:"You dont have permission"})

      }
     
 }

 onlyAdmin = async(req, res, next) => {
     
  const userId =  req.user
  
  var userDetails = await User.findOne({ where: { userId: userId } })

  console.log(userDetails)

  if(req.user.role === 'Admin')
  {
       next();
  }
  else{

    return res.status(401).send({status:'Failed!',message:"You dont have permission"})

  }
 
}

onlyActiveUser = async(req, res, next) => {

  var userDetails = await User.findOne({ where: { email: req.body.email } })

    .then( (user) => {
      if (!user) {
        return res.status(404).send({status:false, message: "User Not found." });
      }
      else{
          console.log('User: ',JSON.stringify(user,null, 4))

          if(user.status === 'inActive')
          {
        
            return res.status(401).send({
              status:'Failed!',
              message:"You can not login because your account is not active"
            })
            
          }
          else{
        
                next();
         
              }
      }

    })
 
}

checkIsVerify  = async(req, res, next) => {

  const userDetails = await User.findOne({where :{ email : req.body.email } })
  .then( (user) => {

    if(!user){
      return res.status(400).send({status:false, message:'User not found '});

    }else{

        if(user.isVarify == true)
        {
          next()
        }
        else{
          return res.status(400).send({status:false, message: 'Verify your account'})
        }
    }
  })
}

  UpdateOrderStatusforCustomer = async(req, res, next) => {
    
    const userId =  req.user
    
    var userDetails = await User.findOne({ where: { userId: userId } })

    console.log(userDetails)

    if(req.user.role === 'Customer')
    {
         next();
    }
    else{

      return res.status(401).send({status:'Failed!',message:"You don't have permission"})

    }
  
}


authenticateJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.secret, (err, user) => {
         
            if (err) {
              console.log(err)
               return res.status(403).send({message:'Not valid token'});
            }

            req.user = user;
            next();
            console.log(user)
           
        });
    } else {
      return res.status(403).send({message:'No token provided..'});
    }
};

authenticatePassChange = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.secret, (err, user) => {
       
          if (err) {
            console.log(err)
             return res.status(403).send({message:'Not valid token'});
          }

          if(req.body.email != user.email)
          {
            return res.status(403).send({
                status:'Failed!',  
                message:'You are not valid user to change password'
              });

          }else{
            next()
          }
         
          console.log(user)
         
      });
  } else {
    return res.status(403).send({message:'No token provided..'});
  }
};

authenticateNewPass = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.secret, (err, user) => {
       
          if (err) {
            console.log(err)
             return res.status(403).send({message:'Not valid token'});
          }

          if(req.params.userId != user.userId)
          {
            return res.status(403).send({
                status:'Failed!',  
                message:'You are not valid user '
              });

          }else{
            next()
          }
         
          console.log(user)
         
      });
  } else {
    return res.status(403).send({message:'No token provided..'});
  }
};


validateUser = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.secret, (err, user) => {
        
          if (err) {
            console.log(err)
             return res.status(403).send({message:'Not valid token'});
          }
            console.log(user)
          
           
          if(req.query.userId != user.userId)
          {
            
            return res.status(403).send({
                status:'Failed!',  
                message:'You are not valid user'
              
              });

          }else{
            next()
          }
         
          console.log(user)
         
      });
  } else {
    return res.status(403).send({message:'No token provided..'});
  }
};


  const authJwt = {
    
    verifyToken: verifyToken,
    checkRoles:checkRoles,
    UpdateOrderStatusforCustomer:UpdateOrderStatusforCustomer,
    authenticateJWT:authenticateJWT ,
    onlyAdmin:onlyAdmin, 
    onlyActiveUser:onlyActiveUser,
    checkIsVerify:checkIsVerify,
    authenticatePassChange:authenticatePassChange,
    authenticateNewPass:authenticateNewPass,
    validateUser:validateUser,  
    
  };

module.exports = authJwt;


