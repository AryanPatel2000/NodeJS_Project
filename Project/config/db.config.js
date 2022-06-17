const Sequelize = require('sequelize');
const mysql = require('mysql2');

const db = new Sequelize('project_db', 'root', '', {
    dialect : 'mysql'
})

db.authenticate()
.then( () => {
    console.log('Connection Estlablished Successfully');
})
.catch( err => { console.log(err)})


module.exports = db;

