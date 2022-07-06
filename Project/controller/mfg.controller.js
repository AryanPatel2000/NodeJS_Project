require('dotenv').config();
const db = require('../config/db.config');
const Mfg = require('../models/mfg.model');
const User = require('../models/user.model')

module.exports.createMfg = (req, res, next) => {


    try{

        Mfg.create({
            			
                   mfg_id:req.body.mfg_id,
                   mfg_name:req.body.mfg_name,
                   userId: req.body.userId                  
                                 
            })  
        .then( (mfg) => {
            if(mfg)
             return res.status(200).send({ststus:'Success', message:`mfg successfull inserted with id: ${mfg.mfg_Id}`, res:mfg})

        })
        .catch( (err)=> {
            res.status(500).send({status:'Failed!', message: err.message})
        } )
       

    }catch(err)
    {
        res.status(500).send({status:'Failed!', message: err.message})
        console.log(err)
    }
}