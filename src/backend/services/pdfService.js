const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

async function generatePDF(studentData) {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
             executablePath:"C:\\Users\\shubh\\.cache\\puppeteer\\chrome\\win64-151.0.7922.71\\chrome-win64\\chrome.exe",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu"
            ]
        });

        const page = await browser.newPage();

        const templatePath = path.join(
            __dirname,
            "form-template.ejs"
        );

        // Render EJS → HTML
        const html = await ejs.renderFile(
            templatePath,
            studentData
        );

        // Put HTML into Puppeteer's browser
        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        const outputDirectory = path.join(
            __dirname,
            "../public/generatedPdfs"
        );

        // Make sure directory exists
        await fs.promises.mkdir(outputDirectory, {
            recursive: true
        });

        const pdfPath = path.join(
            outputDirectory,
            `${studentData.student.enrolmentNo}.pdf`
        );

        // HTML → PDF
        await page.pdf({
            path: pdfPath,
            format: "A4",
            printBackground: true
        });

        return pdfPath;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { generatePDF };