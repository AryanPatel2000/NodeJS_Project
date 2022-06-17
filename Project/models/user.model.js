const Sequelize = require('sequelize')
const db = require('../config/db.config')

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: 'An email is required'},
            notEmpty: {msg: 'Email can not be empty'},
            isEmail: {msg: `Please enter proper email format like : ${'example@email.com'}`}
        },
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: 'User first name can not be null'},
            notEmpty: {msg: 'User first name can not be empty'},
           
        },   
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: 'User last name can not be null'},
            notEmpty: {msg: 'User last name can not be empty'},
           
        },   
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: 'User city can not be null'},
            notEmpty: {msg: 'field of city can not be empty'},
           
        },   
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: 'Password is required'},
            notEmpty: {msg: 'Password can not be empty'},  
        }
    },
}, { freezeTableName: true,  timestamps: false})

module.exports = User;

