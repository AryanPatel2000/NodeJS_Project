require('dotenv').config();
const jwt = require('jsonwebtoken')
const db = require('../config/db.config');
const Order = require('../models/order.model')
const Item = require('../models/item.model')
const User = require('../models/user.model')


module.exports.createOrder = (req, res, next) => {

    try{

        Order.create({
            			
                   orderDate:req.body.orderDate || Date.now(),
                   userId:req.body.userId,
                   itemId:req.body.itemId,
                   status:req.body.status,                  
            })  
        .then( (order) => {
            if(order)
             return res.status(200).send({ststus:'Success', message:`order successfull inserted with id: ${order.orderId}`, res:order})

        })
        .catch( (err)=> {
            res.status(500).send({status:'Failed!', message: err.message})
        } )
       

    }catch(err)
    {
        res.status(500).send({status:'Failed!', message: err.message})
        console.log(err)
    }
}


module.exports.viewMyOrders = (req, res) => {

    const query = req.query;
    console.log('Searching: ', query)
    try{
        let userId = req.query.userId;
        let status = req.query.status;
        Order.findAll({ where: req.query})

        .then(order => {

           res.status(200).json({
                    message: `Successfully Get  Order`,
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

   

}

module.exports.showAllOrders = (req, res) => {

    try{
       
        Order.findAll({})

        .then(order => {

           res.status(200).json({
                    message: "All orders " ,
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