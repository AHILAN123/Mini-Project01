const express = require("express");
const router = express.Router();
const User = require("../models/User"); // MongoDB
const { Student } = require("../models/Student"); // PostgreSQL
const { Registration } = require("../models/Registration"); // PostgreSQL
const { requireAuth } = require("../middleware/auth_middle");

router.post("/submit", requireAuth, async (req, res) => {
    try {
        const { semester, paymentDate, subjects } = req.body;

        // 1. Get the logged-in user's email from MongoDB
        const mongoUser = await User.findById(req.userId);
        if (!mongoUser) return res.status(404).json({ error: "User session invalid." });

        // 2. Find their official student record in PostgreSQL using that email
        const pgStudent = await Student.findOne({ where: { email: mongoUser.email } });
        if (!pgStudent) {
            return res.status(403).json({ error: "Your student record has not been provisioned by the Admin yet." });
        }

        // 3. The Golden Rule: Block registration if fees are not cleared!
        if (!pgStudent.feeStatus) {
            return res.status(403).json({ error: "Cannot register: Your institute fee status is still marked as Pending." });
        }

        // 4. Save the Registration Form
        const newReg = await Registration.create({
            enrollmentNo: pgStudent.enrollmentNo,
            semester,
            subjects,
            paymentDate
        });

        return res.status(201).json({ message: "Registration submitted successfully!", data: newReg });

    } catch (err) {
        console.error("Registration Submit Error:", err);
        return res.status(500).json({ error: "Failed to submit registration. Please try again." });
    }
});

module.exports = router;