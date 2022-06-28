require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('../models/user.model')


verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({error:true, message:'No token provided!'});

    }
    jwt.verify(token, process.env.secret, (err, decoded) => {
        if(err){
            return res.status(401).send({error:true, message:'Unauthorized!'});

        }
        req.userId = decoded.id;
        next();
    });

}



  
const verifyRole = {
    verifyToken : verifyToken,
   
  
   
};

module.exports = verifyRole;