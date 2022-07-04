require('dotenv').config();
const {Sequelize, Op, QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const Order = require('../models/item.model');
const Item = require('../models/item.model');
const User = require('../models/user.model');


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
                 return res.status(200).send({status:'Success', message:`Item successfull inserted with id: ${item.itemId}`, res:item})
    
            })
            .catch( (err)=> {
                res.status(500).send({status:'Failed!', message: err.message})
            } )
           
    
        }catch(err)
        {
            console.log(err)
            return res.status(500).send({status:'Failed!', message: err.message})
            
        }
    
    

}

module.exports.updateItem = async(req, res, next) => {

    try {
             
        let item = await Item.findByPk(req.query.itemId);
 

        if (!item) {
            
            return res.status(404).send({
                status:'Failed!',
                message: "Item not found with id = " + req.query.itemId,
           
            });
        } else {
            
            let updatedObject = {
             
                itemName : req.body.itemName, 
                mfg_date : req.body.mfg_date, 
                exp_date: req.body.exp_date,
                price: req.body.price, 
                mfg_Id: req.body.mfg_Id
            }
            
            let result = await Item.update(updatedObject, { where: { itemId: req.query.itemId } });

          
            if (!result) {
                res.status(500).send({

                    message: "Can not update a Item with itemId : " + req.query.itemId,
                   
                });
            }

            res.status(200).send({

                status:'Success',
                message: "Item updated successfully with itemId : " + req.query.itemId,
                
            });
        }

    } catch (error) {

        console.log(error)
        res.status(500).send({
            status:'Failed!',
            message: "Error occuring while updating Item itemId = " + req.query.itemId,
            error: error.message
        });
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

        const query = req.query;
        console.log('Searching: ', query)
        
      try{
        Item.findAll({
            attributes: ['itemId', 'itemName', 'mfg_date', 'exp_date', 'price', 'mfg_id',],
            where: req.query 
          })
            .then(results => {
  
                res.status(200).send({status:'Success', message: `Record found`, totalItems: results.length, res: results});                            
                console.log('Records found: ', JSON.stringify(results,null, 2))
            })
            .catch(error => {
              console.log(error);
              res.status(500).send({ message: "Error occuring while fetching records!",error: error });
            });
      }
      catch( error)
      {
        res.status(500).send({ message: "Error", error: error });
        
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
            limit: 5 ,    
            offset: 0  , 

        })   
        

        const totalPages = Math.ceil(result.count / 5);

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

    const id = req.params.id;
    console.log('itemId: ',id)

   // if(id === Order.itemId && id == Order.status == 'Ordered')

    try{
        // if(req.params.id === Order.itemId && req.params.id == Order.status == 'Ordered')
        // {
        //     console.log('Item can not be deleted');
        //     return res.send('Item can not be deleted')
        // }
        Item.destroy({

            include:[{model:Order}],
            where:{ itemId:id, },
           
        
          }).then( (deleted) => {

                  

                if(deleted)
                {
                    // if(deleted === Order.itemId &&  Order.status == 'Ordered')
                    // {
                    //     console.log('Item can not be deleted');
                    //     return res.send('Item can not be deleted')
                    // }
                    
                    return res.status(200).send({ message: 'Item deleted successfully with id = ' + id });
                }
                else{

                    return res.status(500).send({status:'Failed!', message: `Item not found or invalid id ${id}` });
                }   
                    

            })
            .catch(err => {
                console.log(err)
                res.status(500).send({status:'Failed!', message: "Item not found ",error: err.message});
            })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status:'Failed!', message: "Error occuring while deliting item ",error: err.message});
    }



    //=========================================================
    // const id = req.params.id;
    // console.log('itemId: ',id)
    // try{
    //     Item.destroy({

    //         where:{ itemId: id }
        
    //       }).then( (deleted) => {

    //             if(deleted)
    //             {
    //                 return res.status(200).send({ message: 'Item deleted successfully with id = ' + id });
    //             }
    //             else{
    //                 return res.status(500).send({status:'Failed!', message: `Item not found or invalid id ${id}` });
    //             }   
                    

    //         })
    //         .catch(err => {

    //             res.status(500).send({status:'Failed!', message: "Item not found ",error: err.message});
    //         })
    // }
    // catch(err)
    // {
    //     console.log(err);
    //     res.status(500).send({status:'Failed!', message: "Error occuring while deliting item ",error: err.message});
    // }
    
}