const db = require('../config/db.config');
const Role  = require('../models/role.model')
const User = require('../models/user.model')
const Order = require('../models/order.model')
const Item = require('../models/item.model')
const Mfg = require('../models/mfg.model')
const jwt = require('jsonwebtoken')


module.exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };

  module.exports.adminBoard = (req, res) => {
      
    //res.status(200).send("Admin Content.");
      try{

      User.findAndCountAll({attributes: {exclude: ['password']}})
      .then(users => {
          if(users)
           return res.status(200).send({status:'Success',message:'All registered user', res:users})
           else{
               return res.status(500).send({status:'Failed!', message:'Data not found'})
           }
      })

     
      }
    catch(err)
    {
        res.status(500).send({status:'Failed!', message:'Error ocuuring while fetching records'})
    }
  };


  module.exports.manufacturerBoard = (req, res) => {

    const query = req.query;
    console.log('Searching: ', query)

    try{
      
      Item.findAll(
          { 
            include: [
            {
              model: Mfg,
              where: req.query,
                
            },

          ]
        }, 
      )
      .then(order => {
          if(order)
          return res.status(200).send({status:'Success',message:'All orders...', res:order})
          else{
              return res.status(500).send({status:'Failed!', message:'Data not found'})
          }
      })

   
    }
      catch(err)
      {
          res.status(500).send({status:'Failed!', message:'Error ocuuring while fetching records'})
      }
  };


  module.exports.customerBoard = (req, res) => {

   const query = req.query;
   console.log('Searching: ', query)
   try{

       let userId = req.query.userId;
       
       Order.findAll({ 
        include: [
        {
          model: User,
          where: req.query,  
          
        },

      ]
      }, )

       .then(order => {

          res.status(200).json({
                   message: `Successfully Get  Order with userId : ${userId}`,
                   Total_order: order.length,
                   orders: order,
                       
               });        
          
       })
       .catch(error => {
           console.log(error)
           res.status(500).json({message:`not found` , error: error });
       });
    }
      catch(err)
      {
          res.status(500).send({message:"Something went wrong", error:err})
      }

  
  };



module.exports.showOrderToAdmin = (req, res) => {

  try{
       
    Order.findAll({})

    .then(order => {

       res.status(200).json({
                message: "All orders.. " ,
                Total_order: order.length,
                orders: order,
                    
            });        
       
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message:`Order not found` , error: error });
    });
}
catch(err)
{
    res.status(500).send({message:"Something went wrong", error:err})
}
}
