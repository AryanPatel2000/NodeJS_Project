require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.config');

const User = require('../models/user.model')
//


module.exports.signUp = (req, res) => {
    //Check email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then( user => {
        if(user)
        {
            res.status(400).send({message: "Email is already in use!", res:user})
        }
        else{
        
            User.create({
                email : req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                city: req.body.city,
                password: bcrypt.hashSync(req.body.password, 8)
            })
            .then(user => { res.status(200).send({message: "User was registered successfully!", res:user})})
            
            .catch( err => { res.status(500).send({message: err.message})});
        }
    });
}

module.exports.findAll = (req, res) => {
    User.findAndCountAll({attributes: {exclude: ['password']}})
    .then(users => {
        res.send(users)
    })
    .catch(err => {
        res.send(err)
    })
}

module.exports.findByPk = (req, res) => {
    User.findByPk(req.params.userId, { attributes: {exclude: ['password']}},)
    .then(users => {
        res.send(users)
    })
    .catch(err => {
        res.send(err)
    })
}

module.exports.update = (req, res) => {
    const id = req.params.userId;
    User.update({email : req.body.email, firstName : req.body.firstName, lastName: req.body.lastName, city: req.body.city} , 
        {where : {id: req.params.userId}}
        )
        .then( () => {
            res.status(200).send({ message: 'user updated successfully with id = ' + id });
        })
        .catch(err => {
            res.send(err)
        });
}

module.exports.delete = (req, res) => {
    const id = req.params.userId;
    User.destroy({ where: {id: id}})
    .then( () => {
        res.status(200).send({ message: 'user deleted successfully with id = ' + id });
    })
    .catch(err => {
        res.send(err)
    });
}


module.exports.signIn = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then( user => {
        if(!user)
        {
            res.status(404).send({message: "Invalid Email!"});
        }else{
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if(!passwordIsValid){
                res.status(401).send({accessToken: null, message: 'Invalid password!'})
            }

            let token = jwt.sign({id: user.id}, process.env.secret, {
                expiresIn: 86400 // 24 hours * 3600 seconds -> (1 hour)
            });

            res.status(200).send({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName:user.lastName,               
                accessToken: token,

            })
        }
    })
    .catch( err => {
       return res.status(500).send({ error:true,message: err });
    })
}