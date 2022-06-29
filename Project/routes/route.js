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

const passport = require('passport')

module.exports = function(app) {



    app.get('/user/all',[verifyRole.verifyToken], userController.findAll)
 

    app.get('/user/find/:userId', userController.findByPk)
    app.put('/user/update/:userId', userController.update)

    
    app.put('/user/updateByToken/', userController.updateByToken)  //Update using token

   app.get('/user/getAllWithAuth',[authJwt.verifyToken], userController.getAllwithAuth) //Get users list (with authentication)
 

   app.delete('/user/delete/:userId', userController.delete)

   app.delete('/user/deleteByToken/', userController.deleteByToken) //Delete using token


   app.post('/item/add',[verifySignUp.validateToken,], itemController.addItem) //add item in item table itemId
   app.put('/item/updateItem/:id',[verifySignUp.validateToken,], itemController.updateItem) 

   app.get('/item/getAll/', itemController.getAll) //get all  for item

   app.get('/item/filterAndSearch', itemController.filterAndSearch) // filter and search

   app.get('/item/pagination', itemController.itemPagination) // item pagination

   app.get('/item/sortExpDate', itemController.sortExpDate) //Sorting based on Date, "expiryDate" 

   app.post('/order/createOrder',  [authJwt.verifyToken] , orderController.createOrder) // create Order

  app.get('/order/viewMyOrders' ,[authJwt.verifyToken],  orderController.viewMyOrders) // view my orders using auth 

    
  //const permit = require('../middleware/auth')

  // app.get('/order/showAllOrder',[authJwt.verifyToken], orderController.showAllOrders) // show all order
   //app.get('/order/showAllOrder',[authJwt.verifyToken], orderController.showAllOrders) // show all order

  
  app.get('/order/showAllOrder',[authJwt.verifyToken, authJwt.isAdmin], orderController.showAllOrders)
  


   app.post('/mfg/createMfg', mfgController.createMfg) //create mfg
   

  

   

}