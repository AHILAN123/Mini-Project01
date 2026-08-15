const { sequelize, Student } = require('./models/Student');

// Extracted exactly from your PDF results
const rollNumbers = [
    "2022CSB013", "2022CSB063", "2024CSB057", "2024CSB076", "2025CSB001",
    "2025CSB002", "2025CSB004", "2025CSB005", "2025CSB006", "2025CSB007",
    "2025CSB008", "2025CSB009", "2025CSB010", "2025CSB011", "2025CSB012",
    "2025CSB013", "2025CSB014", "2025CSB015"
];

const names = [
    "Kapil Dev Raykwar", "Dipanjan Dhibar", "Ishwar Chandra Paul", "Saksham Kevinson", "Ayan Saha",
    "Badal Kumar Das", "Brinda Pal", "Soham Bandyopadhyay", "Nisha Yadav", "Neeraj Meena",
    "Akash Sing", "Jaynta Kumar Ghosh", "Sikha Sasikumar", "Shreyas Roy", "Swapnamay Sarkar",
    "Jyotipada Behera", "Prince Kumar Shah", "Anurag"
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
            
            // Auto-generate the email: e.g., 2025csb013.jyotipada@students.iiests.ac.in
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