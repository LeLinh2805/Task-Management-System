const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {isEmail: true}
    },
    passWord: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: 'default.jpg'
    }

})
module.exports = User;