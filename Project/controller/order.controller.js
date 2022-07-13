require('dotenv').config();
const jwt = require('jsonwebtoken')
const db = require('../config/db.config');
const Order = require('../models/order.model')
const Item = require('../models/item.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const authJwt = require('../middleware/auth')
const { Sequelize, QueryTypes } = require('sequelize');

const randomNumber = require('../helper/random');
const Mfg = require('../models/mfg.model');

module.exports.createOrder = async(req, res, next) => {


    let order = {}

    try{ 


        order.orderNumber = randomNumber(8),
        order.orderDate = req.body.orderDate || Date.now(),
        order.userId = req.body.userId,
        order.itemId = req.body.itemId,
        order.status = 'Ordered' 

        User.findByPk(req.body.userId)

        .then( (user) => {

            console.log(user.status)

            if(user.status == 'inActive')
            {
                return res.status(500).send({Order:'Failed!',message:`Order can't be placed because of user is : ${user.status} `})
            }
       


        Item.findByPk(req.body.itemId)
        .then( result => {
            console.log(result.exp_date, new Date())
         
        if( new Date(result.exp_date)  <= new Date())
        {   
           return res.status(500).send({Order:'Failed!',message:`Order can't be placed because of item is out of expiry date : ${result.exp_date} `})
        }
        else
        {
            Order.create(order)
            .then(ordered => {
                return res.status(200).send({Order:'Success', message:'Thank you for your order', res:ordered})
            })
        }
        })
    })
       
    }
    catch(err)
    {
        //console.log(err)
        return res.status(500).send({Order:'Failed!', message:'Something went wrong while placing order', error:err.message})
    }
      
}


module.exports.viewMyOrders = async(req, res, next) => {

    try{
       
        const odd =  await Order.findAll({where: req.query})
        .then(order => {

            if(order)
            {
                return res.status(200).json({
                    message: `Successfully Get Order`,
                    Total_order: order.length,
                    orders: order,
                        
                });      
            }
            else{
                return res.status(400).json({
                    message: `Order not found`,
                          
                });   
            }
            
           
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({message:`not found` , error: error.message });
        });
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({message:"Something went wrong", error:err.message})
    }

}

module.exports.showAllOrders = (req, res) => {


    const id = req.user
    console.log(id)

    try{
       
        Order.findAll({ })

        .then(order => {

           res.status(200).json({
                    message: "All orders " ,
                    Total_order: order.length,
                    orders: order,
                        
                });        
           
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({message:`Order not found` , error: error.message });
        });
    }
    catch(err)
    {
        res.status(500).send({message:"Something went wrong", error:err})
    }

}


module.exports.showAllOrdersToMfg = (req, res) => {

    const id = req.user
    console.log(id)

    try{
       
        if(req.user.role == 'Manufacturer')
        {
            Mfg.findAll( {where:{ userId : req.user.userId}},{ include:[ {model:User}] })

            .then(order => {
    
               res.status(200).json({
                        message: "All orders " ,
                        Total_order: order.length,
                        orders: order,
                            
                    });        
               
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({message:`Order not found` , error: error.message });
            });
        }

    }
    catch(err)
    {
        res.status(500).send({message:"Something went wrong", error:err})
    }

}


module.exports.updateOrderStatus = async(req, res, next) => {


     try {
         let order_id = req.query.orderId;
         let order = await Order.findByPk(req.query.orderId);
  
 
         if (!order) {
             
             res.status(404).send({
                 status:'Failed!',
                 message: "Order not found with id = " + order_id,
            
             });
         } else {
             
             let updatedObject = {
              
                 status: req.body.status,
             }
             
             let result = await Order.update(updatedObject, { where: { orderId: req.query.orderId } });
 
           
             if (!result) {
                 res.status(500).send({

                     message: "Can not update a Order status with id = " + req.query.orderId,
                    
                 });
             }
 
             res.status(200).send({

                 status:'Success',
                 message: "Order status updated successfully with id = " + req.query.orderId,
                 
             });
         }

     } catch (error) {

         console.log(error)
         res.status(500).send({
             status:'Failed!',
             message: "Error occuring while updating order status with id = " + req.query.orderId,
             error: error.message
         });
     }

}

module.exports.updateOrderStatusByCustomer = async(req, res, next) => {


    if(req.user.role === 'Customer')
    {
        let order_id = req.query.orderId;
        let order = await Order.findByPk(req.query.orderId);

        if (!order) {
            
            res.status(404).send({
                status:'Failed!',
                message: "Order not found with id = " + order_id,
           
            });
        }

        else {
            
            let updatedObject = {
             
                status: req.body.status,
            }
            
            if(req.body.status === 'Ordered' || req.body.status === 'Canceled' )
            {
                 await Order.update(updatedObject, { where: { orderId: req.query.orderId } })

                .then( () => {

                   return res.status(200).send({

                        status:'Success',
                        message: `Order status updated successfully with orderId: ${req.query.orderId} and status: '${req.body.status}'` ,
                        
                    });
                })
                .catch( (error) => {

                    return  res.status(500).send({

                        status:'Failed!',
                        message: `Can not update  Order status with orderId: ${req.query.orderId}`,
                        error:error.message
                       
                    });
                })

            }else if(req.body.status === 'Pending' || req.body.status === 'Delivered' || req.body.status === 'Dispatched' )
               
                {
                    return  res.status(500).send({

                        status:'Failed!',
                        message: `You can not update  Order status with '${req.body.status}' `,
                       
                    });

                }

            else
            {
                return  res.status(500).send({
                    status:'Failed!',
                    message: `Error occuring while updating order status `,              
                });
            }
            
                   
           
        }

    }
    
}

module.exports.generateInvoice = async(req, res, next) => {


   const orders =  await Order.findAll(
        { 
            include: [   
                {           
                    model: Item,
                    attributes: {exclude: ['image', ]},
                                         
                },
                {
                    model: User,
                    attributes: [],                  
                    where: req.query,
    
                }
            ]

            
          }
        )

        const ordere = await Order.findAll({
            attributes:{  
                  include : [
    
                    [Sequelize.fn('SUM', Sequelize.col('Item.price')), 'Total_amount'],
                                      
                  ],
                  
                  exclude: ['orderId','orderNumber', 'orderDate', 'userId',  'itemId', 'status',  ],
                 
                },
                
                include:[ 
                    {
                        model:Item,
                        attributes :[],
                      
                    },


                    {
                        model: User,
                        
                        attributes: {exclude: ['password','role', 'createdAt', 'updatedAt',  'status', 'isVarify','OTP', 'expireOtpTime',  ],},
                        where: req.query
                     }
                ]
              
        } )

        .then( (ordere) => {

            if(!ordere)
            {
                console.log(!ordere)
                return res.status(400).send({
                  status:false,
                  message:'Order not found',

              })  
            }
            else{
                return res.status(200).send({

                    message: "Your order" ,
                    Total_order: orders.length,
                    orders: orders,
                    totalAmount: ordere,
                        
                });
            }
            
        })
        .catch( (err) => {
            console.log(err);
            return res.status(400).send({
                status:false,
                message:'Order not found',

            }) 
        })
         
                
 
}
