const { DataTypes } = require('sequelize');
const { sequelize } = require('./Student');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Theory', 'Practical'), // Distinguishes Theory vs Lab
        allowNull: false
    },
    subjectType: {
        type: DataTypes.ENUM('Core', 'Elective'),
        defaultValue: 'Core'
    },
    credits: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = { Course };