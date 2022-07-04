require('dotenv').config();
const db = require('../config/db.config')
const jwt = require('jsonwebtoken');
const User = require('../models/user.model') 

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




isAdmin = async(req, res, next) => {
    
   User.findByPk(1)
   .then((admin) => {
          console.log(admin)
       admin.getRoles()
      .then(roles => {

        for (let i = 0; i < roles.length; i++)
         {
          if (roles[i].name === "Admin")
           {
                next();
                return;
           }
        }
        res.status(403).send({
          message: "Require Admin Role!"
        });
        return;
      });
    });
  };

  
  isManufacturer = (req, res, next) => {
    //User.findByPk(req.userId)
    User.findByPk(2)
    .then(user => {
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "Manufacturer") {
            next();
            return;
          }
        }
        res.status(403).send({
          message: "Require Manufacturer Role!"
        });
      });
    });
  };
  

  isCustomer = (req, res, next) => {
    //User.findByPk(req.userId)
    User.findByPk(4)
    .then(user => {
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "Customer") 
          {
            next();
            return;
          }
        }
        res.status(403).send({
          message: "Require any Role!"
        });
      });
    });
  };

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




  const authJwt = {
    
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isManufacturer: isManufacturer,
    isCustomer:isCustomer,
    checkRoles:checkRoles,
    UpdateOrderStatusforCustomer:UpdateOrderStatusforCustomer,
    authenticateJWT:authenticateJWT ,
    onlyAdmin:onlyAdmin, 
    
  };

module.exports = authJwt;


