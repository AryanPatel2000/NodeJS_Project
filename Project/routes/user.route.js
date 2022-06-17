const auth = require('../middleware/auth')
const userController = require('../controller/user.controller')

const express = require('express');
var router = express.Router();


module.exports = function(app) {

    app.post('/user/signUp', userController.signUp)
    app.post('/user/signIn',  userController.signIn)
    app.get('/user/all', userController.findAll)
    app.get('/user/find/:userId', userController.findByPk)
    app.put('/user/update/:userId', userController.update)
    

}







//=========================================
// module.exports = function(app){
    
//     const users = require('../controller/user.controller')

//     //Retrive all user
//     app.get('/api/users', users.findAll);

//     //Retrive a single user by id
//     app.get('/api/users/:userId', users.findByPk);

//     //Update user with id
//     app.put('/api/users/:userId', auth, users.update);

//     //Delete user with id
//     app.delete('/api/users/:userId', auth, users.delete);

//     //User signup
//     app.post('/api/user/signup', users.signup);

//     //Usersignin
//     app.post('/api/user/signin', users.signin);
// }
