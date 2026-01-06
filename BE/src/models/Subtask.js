const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subtask = sequelize.define('Subtask', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
        defaultValue: 'TODO'
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Subtask;