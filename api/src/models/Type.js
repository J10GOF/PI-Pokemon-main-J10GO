const { DataTypes, sequelize } = require('sequelize');
const path = require('path');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('type', {
   id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {timestamps: false,}
  );
};