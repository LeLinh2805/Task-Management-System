const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Task = sequelize.define('Task', {
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
    visibility: {
        type: DataTypes.ENUM('PRIVATE', 'PUBLIC'),
        defaultValue: 'PRIVATE'
    },
    attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assigneeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})
module.exports = Task;