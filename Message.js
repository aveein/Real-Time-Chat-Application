const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Message = sequelize.define('message', {
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    from_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    to_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
  });

  module.exports = Message;