const { Sequelize, DataTypes } = require('sequelize');

// TODO: Change 'your_password' to your actual local Postgres password!
const sequelize = new Sequelize('iiest_portal', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false // Set to true if you want to see the raw SQL queries in terminal
});

const Student = sequelize.define('Student', {
    enrollmentNo: {
        type: DataTypes.STRING,
        primaryKey: true, 
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        defaultValue: "Computer Science and Technology"
    },
    programme: {
        type: DataTypes.STRING,
        defaultValue: "B.Tech"
    },
    mobile: {
        type: DataTypes.STRING,
        defaultValue: null // Student will update this later in Settings
    },
    feeStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Admin will flip this to true
    }
});

module.exports = { sequelize, Student };