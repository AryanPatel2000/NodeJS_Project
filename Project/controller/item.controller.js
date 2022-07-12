require('dotenv').config();
const express = require('express')
const app = express()
const {Sequelize, Op, QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const Order = require('../models/order.model');
const Item = require('../models/item.model');
const User = require('../models/user.model');

const multer = require('multer')
const path = require('path');


module.exports.addItem = (req, res, next) => {

    try{
        Item.create({

            itemName:req.body.itemName,
            mfg_date:req.body.mfg_date,
            exp_date:req.body.exp_date,
            price:req.body.price,
            mfg_Id:req.body.mfg_Id,
            image: req.file.path
           
        })  
    .then( (item) => {
         if(item)
            { 
                return res.status(200).send({
                    status:'Success', 
                    message:`Item successfull inserted with id: ${item.itemId}`, res:item
                })
            }

        })
        .catch( (err) => {

            console.log(err)
            res.status(400).send({
                status:'Failed',
                message:'Error Occured',
                error: err.message
            })
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(400).send({status:false, message:'Something went wrong', error:err.message})
    }
         

}

module.exports.updateItem = async(req, res, next) => {

    try {
       
            let updatedObject = {
             
                itemName : req.body.itemName, 
                mfg_date : req.body.mfg_date, 
                exp_date: req.body.exp_date,
                price: req.body.price, 
                mfg_Id: req.body.mfg_Id,
                image: req.file.path
            }
            
            let result =  Item.update(updatedObject, { where: { itemId: req.query.itemId } });

          
            if (!result) {
                res.status(500).send({

                    message: "Can not update a Item with itemId : " + req.query.itemId,
                   
                });
            }

            res.status(200).send({

                status:'Success',
                message: "Item updated successfully with itemId : " + req.query.itemId,
                
            });
             
   
    } catch(error) {

        console.log(error)
        res.status(500).send({
            status:'Failed!',
            message: "Error occuring while updating Item itemId = " + req.query.itemId,
            error: error.message
        });
    }
   

}

module.exports.getAll = async(req, res) => {


    try{
        const page = parseInt(req.query.page)  ;
        const limit = parseInt(req.query.limit) ;

        const offset = page ? page * limit : 0 ;
        let dateSorting = (req.query.dateSorting === 'true')
      
        let desc = (req.query.desc === 'true');
              
        
        let result = {};   

                
                if( req.query.itemId || req.query.itemName || req.query.mfg_date || req.query.exp_date || req.query.price )
                {
                   // console.log('Query: ',req.query.itemId || req.query.itemName)
                     result =  await Item.findAndCountAll({
                         where : {
                            [Op.or]: {
                                itemId: {
                                    [Op.like]: req.query.itemId,

                                },
                                itemName: {
                                    [Op.like]: req.query.itemName,
                                },
                                mfg_date: {
                                    [Op.like]: req.query.mfg_date,
                                },
                                exp_date: {
                                    [Op.like]: req.query.exp_date,
                                },
                                price: {
                                    [Op.like]: req.query.price,
                                }
                            }
                      },
                      attributes:{exclude:['image']}
                    
                    })
                   
                }
              else if(dateSorting == false && desc == false){
                                     

                    result = await Item.findAndCountAll({
                        attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                        limit : limit ,
                        offset: offset,  
                      });

                      return res.send({status:'Success..',message:'With no sorting',res:result})
                } 
                else if(dateSorting == true && desc ==false)
                    {
                        result = await Item.findAndCountAll({
                            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                             
                            order: [
                                ['exp_date', 'ASC']
                            ],
                            limit : limit ,
                            offset: offset,              
                        });
                        return res.send({status:'Success..',message:'Sorting exp_date with Ascending order',res:result})

                    }
                    else if(dateSorting == true && desc ==true)
                    {
                        result = await Item.findAndCountAll({
                            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                
                            order: [
                                ['exp_date', 'DESC']
                            ],
                            limit : limit ,
                            offset: offset,             
                        });
                        return res.send({status:'Success..',message:'Sorting exp_date with Descending order',res:result})

                    }
                    else if(desc == true)
                    {
                        result = await Item.findAndCountAll({
                            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                
                            order: [
                                ['exp_date', 'DESC']
                            ],
                            limit : limit ,
                            offset: offset,              
                        });
                       
                    }
         
                else {

                    
                    result = await Item.findAndCountAll({

                        where: {
                            itemId: {
                                [Op.eq]: req.query.itemId,
                            },
                                
                        },
                        attributes: { 

                            exclude:['image'],
                            limit : limit ,
                            offset: offset,

                        }
                    })
                    .then(results => {
                    
                        if(!results)
                        {
                            return res.status(500).send({status:'Failed!', message:'Item not found', })
                        }
                        else
                        {
                            return res.status(200).send({status:'Success',message:`item found `, res:results})
                        }
                   
                    // console.log("Items: ", JSON.stringify(item, null, 3))          
                    })
                    .catch(err => {
                         console.log(err);
                        res.status(500).send({status:'Failed!', message:'Item not found', error:err.message})
                        
                    })
                            
                  
                  }

        const totalPages = Math.ceil(result.count / limit);

        console.log("Total pages: ", totalPages)
  
        const response = {
          "totalPages": totalPages,
          "pageSize": result.rows.length,
          "Items": result.rows
        };

        res.status(200).send({status:'Success',res:response});
        

      }catch(error) {
          console.log(error)
            res.status(500).send({
                    message: "Can NOT complete request!",
                    error: error.message,
                });
      }      
   
                            

}

module.exports.filterAndSearch = async(req, res) => {

        const query = req.query;
        console.log('Searching: ', query)
        
      try{
        Item.findAll({
            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
            where: req.query 
          })
            .then(results => {
  
                res.status(200).send({

                    status:'Success', 
                    message: `Record found`, 
                    totalItems: results.length, 
                    res: results
                });                            
               // console.log('Records found: ', JSON.stringify(results,null, 2))
            })
            .catch(error => {
              console.log(error);
              res.status(500).send({ message: "Error occuring while fetching records!",error: error.message });
            });
      }
      catch( error)
      {
        res.status(500).send({ message: "Error", error:  error.message });
        
      }

}

module.exports.itemPagination = async(req, res) => {
     
    const page = parseInt(req.query.page)  ;
    const limit = parseInt(req.query.limit) ;

    const offset = page ? page * limit : 0 ;
   // console.log('Offset: ', offset)
   
    if(!limit || limit === undefined )
    {

        
        let result = await Item.findAndCountAll({
            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
            limit: 10 ,    
            offset: 0  , 

        })   
        

        const totalPages = Math.ceil(result.count / 10);

       // console.log("Total pages: ", totalPages)

        const response = {
            "totalPages": totalPages,
            "pageNumber" : page,
            "pageSize": result.rows.length ,
            "Items" : result.rows ,

        }

        return res.status(200).send({status:'Success', res:response})
    }

    
    let result = {};
     
        result = await Item.findAndCountAll({
            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
            
            limit : limit ,
            offset: offset,          
           
        })
    const totalPages = Math.ceil(result.count / limit);

        console.log("Total pages: ", totalPages)

        const response = {
            "totalPages": totalPages,
            "pageNumber" : page,
            "pageSize": result.rows.length,
            "Items" : result.rows ,

        }

        res.status(200).send({status:'Success', res:response})

}


module.exports.sortExpDate = async(req, res) => {

    try{
      
        let dateSorting = (req.query.dateSorting === 'true')
      
        let desc = (req.query.desc === 'true');
              
        let result = {};   

               if(dateSorting == false && desc == false){
                    result = await Item.findAndCountAll({
                        attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],

                      });

                      return res.send({status:'Success..',message:'With no sorting',res:result})
                } 
                else if(dateSorting == true && desc ==false)
                    {
                        result = await Item.findAndCountAll({
                            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                
                            order: [
                                ['exp_date', 'ASC']
                            ]             
                        });
                        return res.send({status:'Success..',message:'Sorting exp_date with Ascending order',res:result})

                    }
                    else if(dateSorting == true && desc ==true)
                    {
                        result = await Item.findAndCountAll({
                            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                
                            order: [
                                ['exp_date', 'DESC']
                            ]             
                        });
                        return res.send({status:'Success..',message:'Sorting exp_date with Descending order',res:result})

                    }
                    else if(desc == true)
                    {
                        result = await Item.findAndCountAll({
                            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                
                            order: [
                                ['exp_date', 'DESC']
                            ]             
                        });
                       
                    }
         
                else { 
                    result = await Item.findAndCountAll({

                        attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
                  
                      order: [
                            ['exp_date', 'DESC']
                      ]             
                    });
                  }
  
        const response = {
       
          "pageSize": result.rows.length,
          "Items": result.rows
        };

        res.status(200).send({status:'Success',res:response});

      }catch(error) {
        res.status(500).send({

          message: "Error -> Can NOT complete request!",
          error: error.message,

        });
      }      

}



module.exports.deleteItemByAdmin = async(req, res, next) => {

    const findItem = Order.findOne({

        include: [
            {
              model: Item,
              where: {itemId:req.params.id } 
              
            },
    
          ]
        
    }).then( user => {
        if(user)
        {
            res.status(400).send({status: false, message: "Failed! item is already in use!"});
        }
        else{

             Item.destroy({ where:{itemId:req.params.id } });
           return res.status(200).send({ status: true, message: `Item successfully deleted with itemId: ${req.params.id}`})


        }
    });
  
}
