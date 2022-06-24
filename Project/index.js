const express = require('express');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}))

const db = require('./config/db.config')

const User = require('./models/user.model')
const Order = require('./models/order.model')
const Item = require('./models/item.model')
const Mfg = require('./models/mfg.model')


// Mfg.sync({force:true})
//     .then( () => {
//         console.log('Resync DB');
//     })


// Order.sync({force:true})
//     .then( () => {
//         console.log('Resync DB')
//     })

// Item.sync({force:true})
//     .then( () => {
//         console.log('Resync Db')
//     })


// User.sync({force:true})
// .then( () => {
//     console.log('Resync Db')
// })


require('./routes/route')(app)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Server listening on port: ', port);
})

