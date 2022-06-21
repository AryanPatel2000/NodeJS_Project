const Sequelize = require('sequelize');
const db = require('../config/db.config')

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