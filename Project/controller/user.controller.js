require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.config');

const User = require('../models/user.model')

module.exports.signUp = (req, res) => {
    //Check email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then( user => {
        if(user)
        {
            res.status(400).send({message: "Email is already in use!",})
        }
        else{
        
            User.create({
                email : req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                city: req.body.city,
                role: req.body.role,
                password: req.body.password
               // password: bcrypt.hashSync(req.body.password, 8)
            })
            .then(user => { res.status(200).send({message: "User was registered successfully!", res:user})})
            
            .catch( err => { res.status(500).send({message: err.message})});
        }
    });
   
}

module.exports.findAll = (req, res) => {

    try{
        User.findAndCountAll({attributes: {exclude: ['password']}})
        .then(users => {
            if(users)
             return res.status(200).send({status:'Success',message:'Record', res:users})
             else{
                 return res.status(500).send({status:'Failed!', message:'Data not found'})
             }
        })

       
    }
    catch(err)
    {
        res.status(500).send({status:'Failed!', message:'Error ocuuring while fetching records'})
    }
   
}


module.exports.findByPk = (req, res) => {

    try{

        const id = req.params.userId
        User.findByPk(id, { attributes: {exclude: ['password']}})
        .then( (user) => {

            if(user)
            {
                return res.status(200).send({status:'Success', message:'Record found' ,res:user})
            }
            else
            {
                return res.status(500).send({status:"Failed!",message:`${id} id you entered is not valid`})
            }
        })
    }
    catch( err)
    {
        return res.status(500).send({status:"Failed!",message: 'Error occuring while fetching record', error:err})
    }

 
}

module.exports.update = async(req, res) => {


    try{
       const id = req.params.userId;
           
               await  User.update({email : req.body.email, firstName : req.body.firstName, lastName: req.body.lastName, city: req.body.city, role: req.body.role} , 
                        {where : {userId: req.params.userId}},
                       
                    ) 
                    .then( (user) => {
                       
                        if(user)
                        {
                            return res.status(200).send({status:'Success', message: 'user updated successfully with id = ' + id });
                        }
                        else
                        {
                            return res.status(500).send({status: 'Failed', message: 'User id not found'})
                        }
                             
                    })

    }
    catch( err )
    {
        res.status(500).send({status:'Failed', message:'Error occuring while updating records'})
    }

}

module.exports.updateByToken = (req, res) => {

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
    })
    const id = req.userId;
    User.update({email : req.body.email, firstName : req.body.firstName, lastName: req.body.lastName, city: req.body.city ,role: req.body.role} , 
        {where : {userId: req.userId}}
        )
        .then( () => {
            res.status(200).send({ message: 'user updated successfully with id = ' + id });
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({error:true, message:err})
        });
 

}


module.exports.delete = (req, res) => {


    const id = req.params.userId;
    User.destroy({ where: {userId: id}})
    .then( (user) => {
      
        if(user)
        {
            res.status(200).send({ status : 'Success', message: 'user deleted successfully with id = ' + id });
        }
        else
        {
            res.status(401).send({status : 'Failed!',message: 'Id not found'})
        }
       
    })
    .catch(err => {
        res.status(401).send({ status : 'Failed!', message: 'Error occuring while deleting record', error:err})
    });
}

module.exports.deleteByToken = (req, res) => {

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
    })
    const id = req.userId;
    User.destroy({where: {id:id}})
    .then( () => {
      
        res.status(200).send({ message: 'user deleted successfully with id = ' + id });
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({message: 'Id not found', error:err})
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
                return res.status(401).send({accessToken: null, message: 'Invalid password!'})
            }

            let token = jwt.sign({id: user.id}, process.env.secret, {
                expiresIn: 86400 // 24 hours * 3600 seconds -> (1 hour)
            });

            res.status(200).send({
                userId: user.id,
                email: user.email,
                role:user.role,
                firstName: user.firstName,
                lastName:user.lastName,               
                accessToken: token,

            })
        }
    })
    .catch( err => {
        res.send({status:'Failed!',message:'error occuring while matching data',error:err})
    })
}

module.exports.getAllwithAuth = (req, res) => {

    try{
         User.findAndCountAll({ attributes: {exclude: ['password']}})
        
        .then( (user) => {

            res.status(200).send({ message: 'user found', res:user });
           
            })        
    }
    catch(err)
    {
        res.status(500).send({message:'Invalid token', err:err.message})
    }
   
}