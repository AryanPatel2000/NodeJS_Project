require('dotenv').config();
const db = require('../config/db.config');
const Order = require('../models/order.model')

module.exports.createOrder = (req, res, next) => {

    try{

        Order.create({
            			
                   orderDate:req.body.orderDate,
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