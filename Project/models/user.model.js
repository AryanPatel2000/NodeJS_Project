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
        
    },
    status: {
        type:  Sequelize.ENUM,
        values: ['Active', 'inActive'],
        validate: {
            isIn: {
                args: [['Active', 'inActive']],
                msg: "Status must be Active or inActive"
            }
        }
    },
    isVarify: {
        type: Sequelize.BOOLEAN,
        validate: {
            isIn: {
                args: [[true, false]],
                msg: "isvarify must contain true or false value"
            }
        }
       
    },
    OTP: {

        type:Sequelize.INTEGER,

    },
    expireOtpTime :{
        type: Sequelize.DATE
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATEONLY,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATEONLY,
    },
   
}, { freezeTableName: true ,
 
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




