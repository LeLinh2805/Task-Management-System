const {sequelize} = require('../config/database');
const {Op} = require('sequelize');
const User = require('./User');
const Task = require('./Task');
const Subtask = require('./Subtask');
const Comment = require('./Comment');
const TaskSnapshot = require('./TaskSnapshot');
const Notification = require('./Notification');

// Mot user co the co nhieu task
User.hasMany(Task, {foreignKey: 'creatorId', as: 'createdTasks'});
Task.belongsTo(User, {foreignKey: 'creatorId', as: 'creator'})

// Mot user co the dc giao nhieu task
User.hasMany(Task,{foreignKey: 'assigneeId', as: 'assigneeTasks'});
Task.belongsTo(User, {foreignKey: 'assigneeId', as: 'assignee'});

// Một Task có nhiều Subtask-Một Subtask thuộc về một Task
Task.hasMany(Subtask, {foreignKey: 'taskId', as: 'subtasks', onDelete: 'CASCADE', hooks: true});
Subtask.belongsTo(Task, {foreignKey: 'taskId', as: 'task'});

//Một Task có nhiều Comment
Task.hasMany(Comment, {foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE', hooks: true});
Comment.belongsTo(Task, {foreignKey: 'taskId', as: 'task' });

//Một User viết nhiều Comment
User.hasMany(Comment, {foreignKey: 'userId', as: 'comments'});
Comment.belongsTo(User, {foreignKey: 'userId', as: 'author'});

//Một task có nhiều snapshot
Task.hasMany(TaskSnapshot, {foreignKey: 'taskId', as: 'history', onDelete: 'CASCADE', hooks: true});
TaskSnapshot.belongsTo(Task, {foreignKey: 'taskId', as: 'task'});

//Một user có nhiều snapshot
User.hasMany(TaskSnapshot, {foreignKey: 'updatedBy'});
TaskSnapshot.belongsTo(User, {foreignKey: 'updatedBy', as: 'editor'});

// Một user có nhiều thông báo
User.hasMany(Notification, {foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE'});
Notification.belongsTo(User, {foreignKey: 'userId', as: 'recipient'})

Task.hasMany(Notification, {foreignKey: 'referenceId', constraints: false, as: 'taskNotifications'});
Notification.belongsTo(Task, {foreignKey: 'referenceId', constraints: false, as: 'relatedTask'});

module.exports = {
  sequelize,
  Op,
  User,
  Task,
  Subtask,
  Comment,
  TaskSnapshot,
  Notification
};
