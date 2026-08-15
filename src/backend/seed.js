const { sequelize, Student } = require('./models/Student');

// Extracted exactly from your PDF results
const rollNumbers = [
    "2025CSB120"
];

const names = [
    "Aryan Behera"
];

async function seedDatabase() {
    try {
        console.log("Connecting to PostgreSQL...");
        await sequelize.authenticate();
        
        // Ensure table exists
        await sequelize.sync();

        console.log("Processing student data...");
        const studentsToInsert = [];

        for (let i = 0; i < rollNumbers.length; i++) {
            const roll = rollNumbers[i];
            const name = names[i];
            
            // Auto-generate the email
            const rollLower = roll.toLowerCase();
            const firstName = name.split(" ")[0].toLowerCase();
            const email = `${rollLower}.${firstName}@students.iiests.ac.in`;

            studentsToInsert.push({
                enrollmentNo: roll,
                fullname: name,
                email: email,
                department: "Computer Science and Technology",
                programme: "B.Tech",
                feeStatus: true // Setting to true so you can test PDF generation later!
            });
        }

        // Bulk insert into Postgres
        await Student.bulkCreate(studentsToInsert, { ignoreDuplicates: true });

        console.log(`✅ Successfully seeded ${studentsToInsert.length} students into the database!`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();