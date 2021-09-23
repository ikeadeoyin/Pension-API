'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employees.belongsTo(models.Employers)
    }
  };
  Employees.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
       validate: {
         isEmail: true,
       },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber:{
      type: DataTypes.STRING,
      // allowNull:false
    },
    employerId:{
      type: DataTypes.STRING
    },
    employerName:{
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Employees',
  });
  return Employees;
};