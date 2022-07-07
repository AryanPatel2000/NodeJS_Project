
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


    app.get("/user/all", rolleController.allAccess);

    app.get(
      "/api/test/admin",
      [authJwt.verifyToken, authJwt.isAdmin],
      rolleController.adminBoard
    );


    // app.get(
    //   '/order/showAllOrder',
    //   [authJwt.verifyToken, authJwt.isAdmin],
    //   rolleController.showOrderToAdmin
    // )


    app.get(
      
      "/api/test/customer",
      [authJwt.verifyToken, authJwt.isAdmin],
      rolleController.customerBoard
    );

    app.get(
      "/api/test/mfg",
      [authJwt.verifyToken, authJwt.isManufacturer],
      rolleController.manufacturerBoard
    );


    app.get(

      '/order/mfg',
      [authJwt.verifyToken, authJwt.isManufacturer],
      rolleController.manufacturerBoard
    )

    app.get(
      
      '/order/ownOrder',
      [authJwt.verifyToken, authJwt.isCustomer],
      rolleController.customerBoard
    )
  };