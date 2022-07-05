const Sequelize = require('sequelize');
const db = require('../config/db.config')

const User = require('./user.model')
const Item = require('./item.model')

const Order = db.define('order', {

    orderId: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    orderNumber: {

        type: Sequelize.STRING,
        
    },
    orderDate: {
        type:Sequelize.DATEONLY,
        allowNull:false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull:false,

    },
    itemId: {
        type:Sequelize.INTEGER,
        allowNull:false
    },
     status: {
          type: Sequelize.ENUM,
          values: ['Delivered','Dispatched','Pending','Canceled','Ordered'],
          defaultValue: 'Pending'
        },
} ,{freezeTableName: true,  timestamps: false})


module.exports = Order;

Order.belongsTo(User, {foreignKey:'userId'})

Order.belongsTo(Item, 
    {foreignKey: 'itemId',
     onDelete: 'cascade',
    })

