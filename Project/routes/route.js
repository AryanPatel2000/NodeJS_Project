const auth = require('../middleware/auth');
const  authJwt = require('../middleware/auth');
const userController = require('../controller/user.controller');
const itemController = require('../controller/item.controller');
const orderController = require('../controller/order.controller');
const mfgController = require('../controller/mfg.controller');

const express = require('express');
var router = express.Router();


module.exports = function(app) {

    app.post('/user/signUp', userController.signUp)
    app.post('/user/signIn',  userController.signIn)
    app.get('/user/all', userController.findAll)
    app.get('/user/find/:userId', userController.findByPk)
    app.put('/user/update/:userId', userController.update)

    
    app.put('/user/updateByToken/', userController.updateByToken)  //Update using token

   app.get('/user/getAllWithAuth',auth, userController.getAllwithAuth) //Get users list (with authentication)

   app.delete('/user/delete/:userId', userController.delete)

   app.delete('/user/deleteByToken/', userController.deleteByToken) //Delete using token


   
   app.post('/item/add', itemController.addItem) //add item in item table

   app.get('/item/getAll/', itemController.getAll) //get all  for item

   app.get('/item/filterAndSearch', itemController.filterAndSearch) // filter and search

   app.get('/item/pagination', itemController.itemPagination) // item pagination

   app.post('/order/createOrder', orderController.createOrder) // create Order


   app.post('/mfg/createMfg', mfgController.createMfg) //create mfg
    
}

