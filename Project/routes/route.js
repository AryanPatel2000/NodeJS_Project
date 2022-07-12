const authJwt = require('../middleware/auth');
const verifyRole = require('../middleware/verifyRole');
const verifySignUp = require('../middleware/verifySignup')
const userController = require('../controller/user.controller');
const itemController = require('../controller/item.controller');
const orderController = require('../controller/order.controller');
const mfgController = require('../controller/mfg.controller');
const rolleController = require('../controller/role.controller')
const Role = require('../models/role.model')
const db = require('../config/db.config')

const jwt = require('jsonwebtoken')
require('dotenv')
const Order = require('../models/order.model')
const express = require('express');
var router = express.Router();

const multer = require('multer')
const path = require('path')
const Item = require('../models/item.model')

const upload = require('../middleware/upload')
module.exports = function(app) {



    app.get('/user/all',[authJwt.authenticateJWT], userController.findAll)
 

    app.get('/user/find/:userId', userController.findByPk)
    app.put('/user/update/:userId', userController.update)

    
    app.put('/user/updateByToken',
            [
                authJwt.validateUser,

            ], userController.updateByToken)  //Update using token

   app.get('/user/getAllWithAuth',
                [
                    authJwt.authenticateJWT,
                    authJwt.onlyAdmin
                
                ], userController.getAllwithAuth) //Get users list (with authentication)
 

   app.delete('/user/delete/:userId', userController.delete)

   app.delete('/user/deleteByToken/', 
            [

                authJwt.validateUser,

            ] ,userController.deleteByToken) //Delete using token


    //API for add new item, can be access by Manufacturer or Admin only
  
        app.post('/item/add',
            [
       
                authJwt.authenticateJWT,
                authJwt.checkRoles,
                upload.single('image')
         
            ],itemController.addItem, )

    
        //API for update item, can be access by Manufacturer or Admin only
        app.put('/item/updateItem/',
            [  

                authJwt.authenticateJWT,
                authJwt.checkRoles,
                upload.single('image')

            ], itemController.updateItem) 

   app.get('/item/getAll/', itemController.getAll) //getAll  for item of dateSorting and filter and search

   app.get('/item/filterAndSearch', itemController.filterAndSearch) // filter and search

   app.get('/item/pagination', itemController.itemPagination) // item pagination

   app.get('/item/sortExpDate', itemController.sortExpDate) //Sorting based on Date, "expiryDate" 


   //app.post('/order/createOrder',  [authJwt.verifyToken] , orderController.createOrder) // create Order
   app.post('/order/createOrder', 
   
         [authJwt.authenticateJWT] , 

         orderController.createOrder) // create Order


  app.get('/order/viewMyOrders' ,
            [
               // authJwt.authenticateJWT,
                authJwt.validateUser
           
            ], orderController.viewMyOrders) // view my orders using auth 

    

  
  app.get('/order/showAllOrder',
                [
                    authJwt.authenticateJWT, 
                   // authJwt.onlyAdmin,showAllOrdersToMfg
                                  
                ], orderController.showAllOrders)

    
    app.get('/order/showAllOrder/mfg',
                [
                    authJwt.authenticateJWT, 
                   // authJwt.onlyAdmin,
                                  
                ], orderController.showAllOrdersToMfg)

  
    app.put('/order/update/status', 
        [  
            authJwt.authenticateJWT,
            authJwt.checkRoles,
           
        ],
         orderController.updateOrderStatus)


         // update status customer => Ordered and Canceled
         app.put('/order/update/status/customer', 
            [
           
            authJwt.authenticateJWT,
            authJwt.UpdateOrderStatusforCustomer,
            

            ],
         orderController.updateOrderStatusByCustomer)



    app.get('/order/show/invoice', orderController.generateInvoice)

   app.post('/mfg/createMfg', mfgController.createMfg) //create mfg generateInvoice  

  
    //API for only Admin can access to get how many users are registered in system

    app.get('/user/admin/access', 

        [
            authJwt.authenticateJWT,
            authJwt.onlyAdmin,
        ], userController.showOnlyAdmin)
   



    
    //Delete Item api which can be accessed by Admin
    app.delete('/admin/delete/item/:id', 
        [
            authJwt.authenticateJWT,
            authJwt.onlyAdmin,
        ], itemController.deleteItemByAdmin)



    app.post('/otp/varifyOtp/:otp', userController.verifyOtp)
   


        //Change password api
   app.post('/password/resetPassword',
        [
            authJwt.authenticatePassChange

        ], userController.resetPasswordLink) // share link of reset password

   app.post('/password/setNewPassword/:userId/:otp', 
        [
            authJwt.authenticateNewPass 

        ],userController.setNewPassword) //set new password



  

}