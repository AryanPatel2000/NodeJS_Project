require('dotenv').config();
const {Sequelize, Op} = require('sequelize')
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const Item = require('../models/item.model')

module.exports.addItem = (req, res, next) => {

    try{

        Item.create({
                   itemName:req.body.itemName,
                   mfg_date:req.body.mfg_date,
                   exp_date:req.body.exp_date,
                   price:req.body.price,
                   mfg_Id:req.body.mfg_Id,
            })  
        .then( (item) => {
            if(item)
             return res.status(200).send({ststus:'Success', message:`Item successfull inserted with id: ${item.itemId}`, res:item})

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

module.exports.getAll = (req, res) => {

    try{
        Item.findAndCountAll({

            where: {
                mfg_Id: {
                    [Op.eq]: 2
                }
            }
        })
        .then(item => {
           
            res.status(200).send({status:'Success',message:'Items whose mfg_Id : 2', res:item})
            console.log("Items whose mfg_Id : 2", JSON.stringify(item, null, 3))          
        })
        .catch(err => {

            res.status(500).send({status:'Failed!', message:'Item not found', error:err})
             
        })

       
    }
    catch(err)
    {
        res.status(500).send({status:'Failed!', message:'Error ocuuring while fetching records'})
    }
}

module.exports.filterAndSearch = async(req, res) => {
   
    const filters = req.query;
    const filteredItems = Item.filter( item => {

        let isValid = true;

        for(key in filters){
            console.log(key, item[key], filters[key]);

            isValid = isValid && item[key] == item[key]
        }
        return isValid
    })

    res.status(200).send({status:'Success',message:'Item found', res:filteredItems})
}
