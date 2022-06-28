const {Sequelize} = require('sequelize');
const db = require('../config/db.config')

const User = require('./user.model')

const Role = db.define('role', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
} ,{freezeTableName: true,  timestamps: false})



module.exports = Role;


Role.belongsToMany(User, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
  });
  User.belongsToMany(Role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
  });


ROLES = ["Admin", "Manufacturer", "Customer"];




