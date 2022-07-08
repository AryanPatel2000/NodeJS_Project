require('dotenv').config();
const db = require('../config/db.config');
const Order = require('../models/order.model');
const Item = require('../models/item.model');
const User = require('../models/user.model');

const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, './uploads')
    
    },

    filename: (req, file, cb) => {

        let fn = file.originalname.split(path.extname(file.originalname))[0] + '' + path.extname(file.originalname);
        cb(null, fn)
        console.log('FileName: ', fn)
        console.log('MIME Type: ', file.mimetype)
    }
})

const imageFilter = (req, file, cb) => {
    

        if(file.mimetype.includes('jpeg') || file.mimetype.includes('jpg') || file.mimetype.includes('png') )
            {
                cb(null, true)
            }
        else{
            cb('Please upload only jpeg or png file..', false);
                        
        }
    
    }

const uploadFile = multer({storage:storage, fileFilter:imageFilter});

module.exports = uploadFile;