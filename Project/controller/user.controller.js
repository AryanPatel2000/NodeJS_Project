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
        res.status(200).send({status:'Success',message:'Record', res:users})
    })
    .catch(err => {

        res.send({status:'Failed!',message:'Error Occuring', error: err})
    })
}


module.exports.findByPk = (req, res) => {

    User.findByPk(req.params.userId, { attributes: {exclude: ['password']}})

    .then( (user) => {

        if(user)
        {
            res.status(200).send({status:'Success', message:'record found' ,res:user})
        }
        else{
            res.status(500).send({status:"fail",message:'Id not found'})
        }   
        
     })
    .catch( (error) => {

        res.status(500).send({status:"fail",message:'Error occuring while fetching record', error:error.message})
    })
 
}

module.exports.update = async(req, res) => {

   const id = req.params.userId;
   await  User.update({email : req.body.email, firstName : req.body.firstName, lastName: req.body.lastName, city: req.body.city} , 
            {where : {id: req.params.userId}}
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
        .catch(err => {

            console.log(error)

            res.status(403).send({status:'Failed!', message: 'Id not found...', error:err})

        });
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
    User.update({email : req.body.email, firstName : req.body.firstName, lastName: req.body.lastName, city: req.body.city} , 
        {where : {id: req.userId}}
        )
        .then( () => {
            res.status(200).send({ message: 'user updated successfully with id = ' + id });
        })
        .catch(err => {
            res.status(500).send({error:true, message:err})
        });
 

}


module.exports.delete = (req, res) => {


    const id = req.params.userId;
    User.destroy({ where: {id: id}})
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
        res.status(401).send({message: 'Id not found', error:err})
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
        res.status(500).send({ error:true,message: err });
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