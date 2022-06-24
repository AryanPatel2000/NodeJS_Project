require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model')
const Order = require('../models/order.model')
//const db = require('../config/db.config');

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if(!token){
        return res.status(403).send({message:'No token provided...'})
    }

    jwt.verify(token, process.env.secret, (err, decoded) => {
        if(err){
            console.log(err);
            return res.status(401).send({message: 'Invalid Token!'});
        }

        req.userId = decoded.id;
        next();
    })
}


module.exports = verifyToken;

