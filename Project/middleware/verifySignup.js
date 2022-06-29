require('dotenv').config()
const db = require('../config/db.config')
const Role = require('../models/role.model');
const User = require('../models/user.model');
const {Sequelize} = require('sequelize')
const jwt = require('jsonwebtoken')

checkDuplicateEmail = (req, res, next) => {
 
      // Email
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        if (user) {
          res.status(400).send({
            message: "Failed! Email is already in use!"
          });
          return;
        }
        next();
      });
    };
  

  
checkRolesExisted = (req, res, next) => {

    if (req.body.roles) {

      for (let i = 0; i < req.body.roles.length; i++) 
      {

        if (!(ROLES).includes(req.body.roles[i]))
         {
           res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles
          });

          return;
        }
        
      }
 
    }
    
    next();
  };


validateToken = (req, res, next) => {

  const authHeader = req.headers.authorization;
   console.log('Token:' ,authHeader)
    
    if(authHeader)
    {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.secret, (err, user) => {
            if (err) {
                return res.status(403).send({message:'Invalide token'});
            }
            req.user = user;
           
            next()
        })
     
    }else{
        return res.status(401).send({message:'Unauthorized'});
    }
  }



  const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
    checkRolesExisted: checkRolesExisted,
    validateToken:validateToken
  
  };
  module.exports = verifySignUp;