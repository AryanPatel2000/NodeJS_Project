require('dotenv').config();
const db = require('../config/db.config')
const jwt = require('jsonwebtoken');
const User = require('../models/user.model') 

const Role = require('../models/role.model')
const {Sequelize} = require('sequelize')


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
          if (roles[i].name === "Customer") {
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

  const authJwt = {
    
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isManufacturer: isManufacturer,
    isCustomer:isCustomer,
    
  };

module.exports = authJwt;


