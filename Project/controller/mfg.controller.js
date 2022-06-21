require('dotenv').config();
const db = require('../config/db.config');
const Mfg = require('../models/mfg.model')

module.exports.createMfg = (req, res, next) => {

    try{

        Mfg.create({
            			
                   mfg_id:req.body.mfg_id,
                   mfg_name:req.body.mfg_name,
                   
                   
            })  
        .then( (mfg) => {
            if(mfg)
             return res.status(200).send({ststus:'Success', message:`mfg successfull inserted with id: ${mfg.mfgId}`, res:mfg})

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