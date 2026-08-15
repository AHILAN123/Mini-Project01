const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Note: using bcryptjs based on your auth.js imports
const User = require("./models/User"); 

async function createAdmin() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/iiest_portal");
        console.log("Connected to MongoDB...");

        const adminEmail = "admin@gmail.com";
        const plainPassword = "AdminPassword123!"; // Here is your admin password!
        const passwordHash = await bcrypt.hash(plainPassword, 10);

        await User.findOneAndUpdate(
            { email: adminEmail },
            { 
                email: adminEmail, 
                passwordHash: passwordHash, 
                isEmailVerified: true 
            },
            { upsert: true, new: true }
        );

        console.log("✅ Admin account securely seeded into MongoDB!");
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${plainPassword}`);
        
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

createAdmin();