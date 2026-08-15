const express = require("express");
const router = express.Router();
const { Student } = require("../models/Student");

// GET /api/admin/students
// Fetches all students from the PostgreSQL database
router.get("/students", async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [['enrollmentNo', 'ASC']] // Sorts them by Roll Number
    });
    return res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    return res.status(500).json({ error: "Failed to fetch student records." });
  }
});

// PUT: Toggle Fee Status
router.put("/students/:id/fee", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        
        student.feeStatus = req.body.feeStatus;
        await student.save();
        
        return res.json({ message: "Fee status updated successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update fee status." });
    }
});

// DELETE: Remove a Student
router.delete("/students/:id", async (req, res) => {
    try {
        const deletedRows = await Student.destroy({ where: { enrollmentNo: req.params.id } });
        if (deletedRows === 0) return res.status(404).json({ error: "Student not found" });
        
        return res.json({ message: "Student deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete student." });
    }
});

// POST: Add a New Student
router.post("/students", async (req, res) => {
    try {
        const { enrollmentNo, fullname, email } = req.body;
        
        const newStudent = await Student.create({ 
            enrollmentNo: enrollmentNo.toUpperCase(), 
            fullname, 
            email: email.toLowerCase(),
            feeStatus: false
        });
        
        return res.status(201).json(newStudent);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Failed to add student. Roll number or Email might already exist." });
    }
});

// PUT: Edit Student Details
router.put("/students/:id", async (req, res) => {
    try {
        const { fullname, email, department } = req.body;
        const student = await Student.findByPk(req.params.id);
        
        if (!student) return res.status(404).json({ error: "Student not found" });

        student.fullname = fullname;
        student.email = email.toLowerCase();
        if (department) student.department = department; 

        await student.save();
        return res.json({ message: "Student updated successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update student." });
    }
});

// POST: Bulk Upload Students via CSV
router.post("/students/bulk", async (req, res) => {
    try {
        const { students } = req.body; // Expects an array of student objects
        
        if (!students || !Array.isArray(students)) {
            return res.status(400).json({ error: "Invalid data format." });
        }

        // Clean and format the data before inserting
        const cleanedData = students.map(s => ({
            enrollmentNo: String(s.enrollmentNo).trim().toUpperCase(),
            fullname: String(s.fullname).trim(),
            email: String(s.email).trim().toLowerCase(),
            department: String(s.department || "Computer Science and Technology").trim(),
            programme: "B.Tech",
            feeStatus: false // Default to unpaid for new semesters
        }));

        // bulkCreate with ignoreDuplicates ensures it doesn't crash if a student already exists
        await Student.bulkCreate(cleanedData, { ignoreDuplicates: true });
        
        return res.json({ message: `Successfully processed ${cleanedData.length} records.` });
    } catch (err) {
        console.error("Bulk upload error:", err);
        return res.status(500).json({ error: "Failed to process bulk upload." });
    }
});

const { Course } = require("../models/Course");

// GET: Fetch courses by semester
router.get("/courses/:semester", async (req, res) => {
    try {
        const courses = await Course.findAll({ 
            where: { semester: req.params.semester },
            order: [['category', 'ASC'], ['courseName', 'ASC']]
        });
        return res.json(courses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch courses." });
    }
});

// POST: Add a new course
router.post("/courses", async (req, res) => {
    try {
        const { semester, courseCode, courseName, category, subjectType, credits } = req.body;
        const newCourse = await Course.create({ semester, courseCode, courseName, category, subjectType, credits });
        return res.status(201).json(newCourse);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Failed to add course." });
    }
});

// DELETE: Remove a course
router.delete("/courses/:id", async (req, res) => {
    try {
        await Course.destroy({ where: { id: req.params.id } });
        return res.json({ message: "Course deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete course." });
    }
});

module.exports = router;