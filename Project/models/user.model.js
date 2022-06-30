const Sequelize = require('sequelize')
const db = require('../config/db.config')
const bcrypt = require('bcryptjs')

const User = db.define('user', {
    userId: {
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
    role: {
       
        type:  Sequelize.ENUM,
        values: ['Admin', 'Manufacturer', 'Customer'],
        validate: {
            isIn: {
                args: [['Admin', 'Manufacturer', 'Customer']],
                msg: "Role must be Admin or Manufacturer or Customer"
            }
        }
        
    }
   
}, { freezeTableName: true,  timestamps: false ,
 
    //for hashing password
    hooks:{
        beforeCreate :(user, options) => {
            return bcrypt.hash(user.password, 10)
            .then( hash => {
                user.password = hash;
            })
            .catch( (err => {console.log(err)}))
        }
    }
})

module.exports = User;




