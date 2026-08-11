const pool = require("../config/postgres");

const getCurrentRegistrationData = async (enrollmentId) => {
    enrollmentId=enrollmentId.toUpperCase();
    // Getting student data
    const studentResult = await pool.query(
        `
        SELECT
            enrollment_id,
            name_english,
            name_hindi,
            mobile
        FROM students
        WHERE enrollment_id = $1
        `,
        [enrollmentId]
    );

    if (studentResult.rows.length === 0) {
        throw new Error("Student record not found");
    }

    const student = studentResult.rows[0];

    // Extracting details from enrollment number
    const enrollmentYear = Number(enrollmentId.substring(0, 4));
    const courseCode = enrollmentId.substring(4, 7);
    const semester = getCurrentSemester(enrollmentYear);

    const gsuiteId = getGsuiteId(
        enrollmentId,
        student.name_english
    );

    // Fetching subjects
    const subjectsResult = await pool.query(
        `
        SELECT
            subject_code,
            subject_name,
            subject_type,
            credits,
            course_type,
            remarks
        FROM "${courseCode}"
        WHERE semester = $1
        `,
        [semester]
    );

    // Separating theory and practical subjects
    const theorySubjects =
        subjectsResult.rows.filter(
            (subject) => subject.subject_type === "THEORY"
        );

    const practicalSubjects =
        subjectsResult.rows.filter(
            (subject) =>
                subject.subject_type === "PRACTICAL" ||
                subject.subject_type === "SESSIONAL"
        );

    // Return cumulative student data for final PDF generation
    return {
        nameEnglish: student.name_english,
        nameHindi: student.name_hindi,
        mobile: student.mobile,
        enrollmentId: enrollmentId,
        gsuiteId: gsuiteId,
        semester: semester,
        theorySubjects: theorySubjects,
        practicalSubjects: practicalSubjects
    };
};


const getCurrentSemester = (enrollmentYear) => {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const academicYear =
        currentYear - enrollmentYear;

    // July onwards = odd semester
    if (currentMonth >= 7) {
        return academicYear * 2 + 1;
    }

    // January-June = even semester
    return academicYear * 2;
};


const getGsuiteId = (enrollmentId, name) => {
    const firstName =
        name.trim().split(/\s+/)[0].toLowerCase();

    return `${enrollmentId}.${firstName}@students.iiests.ac.in`;
};


module.exports = getCurrentRegistrationData;