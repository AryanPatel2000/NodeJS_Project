
const verifySignUp = require('../middleware/verifySignup')
const userController = require('../controller/user.controller');

const rolleController = require('../controller/role.controller')

const authJwt = require('../middleware/auth')

const jwt = require('jsonwebtoken')
require('dotenv')

module.exports = function(app) {

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post(
      "/user/signUp",
      [
        verifySignUp.checkDuplicateEmail,
        //verifySignUp.checkRolesExisted
      ],
      userController.signUp
    );


    app.post("/user/signIn",
      [
        authJwt.onlyActiveUser,
        authJwt.checkIsVerify
      ],
      userController.signIn);


 
    app.get(
      "/api/test/admin",
      [authJwt.authenticateJWT, authJwt.onlyAdmin],
      rolleController.adminBoard
    );



    app.get(
      
      "/api/test/customer",
      [authJwt.authenticateJWT, authJwt.onlyAdmin],
      rolleController.customerBoard
    );

    app.get(
      "/api/test/mfg",
      [authJwt.authenticateJWT, authJwt.onlyAdmin ],
      rolleController.manufacturerBoard
    );


    app.get(

      '/order/mfg',
      [authJwt.authenticateJWT, authJwt.onlyAdmin],
      rolleController.manufacturerBoard
    )

    app.get(
      
      '/order/ownOrder',
      [authJwt.authenticateJWT],
      rolleController.customerBoard
    )
  };