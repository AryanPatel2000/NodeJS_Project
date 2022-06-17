const express = require('express');

const bodyParser = require('body-parser');
const path = require('path')

const app = express();
app.use(express.json());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const db = require('./config/db.config')

const User = require('./models/user.model')

// User.sync({force:true})
// .then( () => {
//     console.log('Alter and Resync Db')
// })


require('./routes/user.route')(app)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Server listening on port: ', port);
})

