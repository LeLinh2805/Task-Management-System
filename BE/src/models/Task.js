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
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    priority: {
        type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
        defaultValue: 'MEDIUM'
    },
    visibility: {
        type: DataTypes.ENUM('PRIVATE', 'PUBLIC'),
        defaultValue: 'PRIVATE'
    },
    attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assigneeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{paranoid: true,})

Task.addHook('afterDestroy', async (task, options) => {
    const { Subtask, Comment, TaskSnapshot } = sequelize.models;
    const transaction = options.transaction;

    // Delete cac thanh phan lien quan
    await Promise.all([
        Subtask.destroy({ where: { taskId: task.id }, transaction }),
        Comment.destroy({ where: { taskId: task.id }, transaction }),
        TaskSnapshot.destroy({ where: { taskId: task.id }, transaction })
    ]);
});

// HOOKS: Restore
Task.addHook('afterRestore', async (task, options) => {
    const { Subtask, Comment, TaskSnapshot } = sequelize.models;
    const transaction = options.transaction;

    // Khoi phuc cac thanh phan lien quan
    await Promise.all([
        Subtask.restore({ where: { taskId: task.id }, transaction }),
        Comment.restore({ where: { taskId: task.id }, transaction }),
        TaskSnapshot.restore({ where: { taskId: task.id }, transaction })
    ]);
});
module.exports = Task;