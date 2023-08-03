//model/pet.js
const { DataTypes } = require('sequelize')
const User = require('./User')
const db = require('../db/conn')

const Pet = db.define('Pet', {
    name:{
        type: DataTypes.STRING, 
        allowNull: false
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    available:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    adopter:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

Pet.belongsTo(User)
User.hasMany(Pet)

module.exports = Pet