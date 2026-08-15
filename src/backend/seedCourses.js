const { sequelize } = require('./models/Student');
const { Course } = require('./models/Course');

const initialCourses = [
    // Semester 3 Theory
    { semester: 3, courseCode: "", courseName: "Mathematics III", category: "Theory", subjectType: "Core", credits: 3 },
    { semester: 3, courseCode: "", courseName: "Physics of Materials", category: "Theory", subjectType: "Core", credits: 3 },
    { semester: 3, courseCode: "CS 2101N", courseName: "Object Oriented Programming and Design", category: "Theory", subjectType: "Core", credits: 3 },
    { semester: 3, courseCode: "CS 2102N", courseName: "Digital Logic", category: "Theory", subjectType: "Core", credits: 3 },
    { semester: 3, courseCode: "CS 2103N", courseName: "Discrete Structures", category: "Theory", subjectType: "Core", credits: 3 },
    // Semester 3 Practical
    { semester: 3, courseCode: "CS 2191N", courseName: "Mini Project-I", category: "Practical", subjectType: "Core", credits: 2 },
    { semester: 3, courseCode: "", courseName: "Physics of Materials Lab", category: "Practical", subjectType: "Core", credits: 2 },
    { semester: 3, courseCode: "CS 2171N", courseName: "Object Oriented Programming and Design Lab", category: "Practical", subjectType: "Core", credits: 2 },
    { semester: 3, courseCode: "CS 2172N", courseName: "Digital Logic Lab", category: "Practical", subjectType: "Core", credits: 2 },

    // Semester 4 Theory
    { semester: 4, courseCode: "CS 2201N", courseName: "Theory of Computation", category: "Theory", subjectType: "Core", credits: 3 },
    { semester: 4, courseCode: "CS 2202N", courseName: "Computer Architecture & Organization", category: "Theory", subjectType: "Core", credits: 3 },
    { semester: 4, courseCode: "CS 2203N", courseName: "Database Management System", category: "Theory", subjectType: "Core", credits: 3 },
    { semester: 4, courseCode: "CS 2204N", courseName: "Design & Analysis of Algorithm", category: "Theory", subjectType: "Core", credits: 3 },
    // Semester 4 Practical
    { semester: 4, courseCode: "CS 2291N", courseName: "Mini Project-II", category: "Practical", subjectType: "Core", credits: 2 },
    { semester: 4, courseCode: "CS 2272N", courseName: "Computer Architecture & Organization Lab", category: "Practical", subjectType: "Core", credits: 2 },
    { semester: 4, courseCode: "CS 2273N", courseName: "Database Management System Lab", category: "Practical", subjectType: "Core", credits: 2 },
    { semester: 4, courseCode: "CS 2274N", courseName: "Design & Analysis of Algorithm Lab", category: "Practical", subjectType: "Core", credits: 2 }
];

async function seed() {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await Course.bulkCreate(initialCourses);
    console.log("✅ Courses seeded into PostgreSQL!");
    process.exit(0);
}
seed();