'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const Employee = require("./employees")
const Employer = require("./employers")
const EmployerOtpModel = require("./employerotpmodel")
const EmployeeOtpModel = require("./employeeotpmodel")

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.Employee = Employee(sequelize, Sequelize)

db.Employer = Employer(sequelize, Sequelize)

db.EmployerOtpModel = EmployerOtpModel(sequelize, Sequelize)

db.EmployeeOtpModel = EmployeeOtpModel(sequelize, Sequelize)

module.exports = db;
