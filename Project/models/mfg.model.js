const Sequelize = require('sequelize');
const db = require('../config/db.config')
const User = require('./user.model')

const Mfg = db.define('mfg',{

    mfg_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    mfg_name: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, {freezeTableName:true, timestamps:false})


module.exports = Mfg;

Mfg.belongsTo(User, {foreignKey:'userId'})