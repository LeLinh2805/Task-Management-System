const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');
const User = require('./User');
const Task = require('./Task');
const Subtask = require('./Subtask');

//1 user co th co nhieu task
User.hasMany(Task, {foreignKey: 'creatorId', as: 'createdTasks'});
Task.belongsTo(User, {foreignKey: 'creatorId', as: 'creator'})

//1 user co the dc giao nhieu task
User.hasMany(Task,{foreignKey: 'assigneeId', as: 'assigneeTasks'});
Task.belongsTo(User, {foreignKey: 'assigneeId', as: 'assignee'});

//Một Task có nhiều Subtask
Task.hasMany(Subtask, {foreignKey: 'taskId', as: 'subtasks', onDelete: 'CASCADE'});

//Một Subtask thuộc về một Task
Subtask.belongsTo(Task, {foreignKey: 'taskId', as: 'parentTask'});

module.exports = {
  sequelize,
  User,
  Task,
  Subtask
};
