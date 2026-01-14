const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskSnapshot = sequelize.define('TaskSnapshot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    actionType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{paranoid: true});

module.exports = TaskSnapshot;