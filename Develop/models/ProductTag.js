const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
   id: {
    types: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
   },
   product_id: {
    types: DataTypes.INTEGER,
    references: {
      model: 'Product',
      key: 'id',
   },
      tag_id: {
    types: DataTypes.INTEGER,
    references: {
      model: 'Tag',
      key: 'id',
    },
   },
  },
 
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
