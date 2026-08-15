const { DataTypes } = require('sequelize');
const { sequelize, Student } = require('./Student');

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    enrollmentNo: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Student,
            key: 'enrollmentNo'
        }
    },
    semester: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subjects: {
        type: DataTypes.JSONB, // Stores the array of subjects natively in Postgres
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

// Create the relationship
Student.hasMany(Registration, { foreignKey: 'enrollmentNo' });
Registration.belongsTo(Student, { foreignKey: 'enrollmentNo' });

module.exports = { Registration };