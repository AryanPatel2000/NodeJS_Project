const Sequelize = require('sequelize')
const db = require('../config/db.config')
const Mfg = require('./mfg.model')

const Item = db.define('item', {
    itemId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    itemName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: 'Item name is required'},
            notEmpty: {msg: 'Item can not be empty'},
           
        },
    },
    mfg_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {msg: 'Item mfg_date can not be null'},
            notEmpty: {msg: 'Item mfg_date can not be empty'},
           
        },   
    },
    exp_date: {
        type: Sequelize.DATEONLY,
       
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {msg: 'Item price can not be null'},
            notEmpty: {msg: 'Item price can not be empty'},
           
        },   
    },
    mfg_Id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
   
   
}, { freezeTableName: true,  timestamps: false })

module.exports = Item;

Item.belongsTo(Mfg, {foreignKey:'mfg_Id'})



