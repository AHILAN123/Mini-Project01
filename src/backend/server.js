const dns = require("dns");
dns.setServers(["1.1.1.1"]);
require("dotenv").config();

require("./models/Course"); // Ensure the Course model is initialized

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const registrationRoutes = require("./routes/registration");
// const pdfRoutes = require("./routes/generatePdfRoutes");
const cleanupPDFs=require("./services/cleanupService.js");
const generatePdfRoutes=require("./routes/generatePdfRoutes.js");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/registration", registrationRoutes);
// app.use("/api/pdf", pdfRoutes);

app.use("/api/generatePdf", generatePdfRoutes);

// Fallback error handler for anything unexpected that slips past a route.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`IIEST Portal backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

// Cleaning up pdfs older than 14 days
setInterval(() => { 
    cleanupPDFs();
}, 24 * 60 * 60 * 1000);

// --- POSTGRESQL CONNECTION ---
const { sequelize } = require("./models/Student");
require("./models/Registration");

sequelize.sync({ alter: true }) // 'alter: true' updates the table if we change the schema later
  .then(() => {
    console.log("PostgreSQL connected: Student table synced");
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });