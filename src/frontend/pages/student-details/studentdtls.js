/* =========================================================
   STUDENT DETAILS PAGE
   ========================================================= */


/* =========================================================
   PROGRAMME → DEPARTMENT MAPPING
   ========================================================= */

const programmeDepartments = {

    "B.Tech": [
        "Aerospace Engineering and Applied Mechanics",
        "Architecture and Planning",
        "Chemistry",
        "Civil Engineering",
        "Computer Science and Technology",
        "Earth Sciences",
        "Electrical Engineering",
        "Electronics and Telecommunication Engineering",
        "Human Resource Management",
        "Humanities and Social Sciences",
        "Information Technology",
        "Mathematics",
        "Metallurgy and Materials Engineering",
        "Mining Engineering",
        "Physics",
        "Mechanical Engineering"
    ],

    "B.Arch": [
        "Architecture and Planning"
    ],

    "Dual B.Tech-M.Tech": [
        "Aerospace Engineering and Applied Mechanics",
        "Architecture and Planning",
        "Chemistry",
        "Civil Engineering",
        "Computer Science and Technology",
        "Earth Sciences",
        "Electrical Engineering",
        "Electronics and Telecommunication Engineering",
        "Human Resource Management",
        "Humanities and Social Sciences",
        "Information Technology",
        "Mathematics",
        "Metallurgy and Materials Engineering",
        "Mining Engineering",
        "Physics",
        "Mechanical Engineering"
    ],

    "Dual BS-MS": [
        "Applied Geology",
        "Physics",
        "Chemistry"
    ]

};



/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        fillEnrollmentId();

    }
);



/* =========================================================
   AUTOMATIC ENROLLMENT ID
   ========================================================= */

/*
   Your actual college email format:

   2025csb001.ayan@students.iiests.ac.in

   We need:

   2025csb001
*/

function fillEnrollmentId() {

    const enrollmentInput =
        document.getElementById(
            "enrollment-id"
        );


    if (!enrollmentInput) {

        console.log(
            "Enrollment ID input not found."
        );

        return;

    }



    /* =====================================================
       STEP 1
       Check if OTP page already saved
       the Enrollment ID.
       ===================================================== */

    let enrollmentId =
        localStorage.getItem(
            "studentEnrollmentId"
        );


    if (
        enrollmentId &&
        enrollmentId.trim() !== ""
    ) {

        enrollmentInput.value =
            enrollmentId.trim();


        console.log(
            "Enrollment ID loaded from localStorage:",
            enrollmentId
        );


        return;

    }



    /* =====================================================
       STEP 2
       Get the verified email saved by OTP page.
       ===================================================== */

    let email =
        localStorage.getItem(
            "verifiedStudentEmail"
        );



    /* =====================================================
       BACKUP EMAIL KEY
       ===================================================== */

    if (!email) {

        email =
            localStorage.getItem(
                "studentEmail"
            );

    }



    /* =====================================================
       BACKUP: sessionStorage
       ===================================================== */

    if (!email) {

        email =
            sessionStorage.getItem(
                "verifiedStudentEmail"
            );

    }



    /* =====================================================
       NO EMAIL FOUND
       ===================================================== */

    if (!email) {

        console.log(
            "No verified student email found."
        );


        return;

    }



    /* =====================================================
       CLEAN EMAIL
       ===================================================== */

    email =
        email.trim();


    console.log(
        "Verified student email:",
        email
    );



    /* =====================================================
       EXTRACT ENROLLMENT ID
       ===================================================== */

    enrollmentId =
        extractEnrollmentId(
            email
        );



    /* =====================================================
       FILL ENROLLMENT ID
       ===================================================== */

    if (enrollmentId) {

        enrollmentInput.value =
            enrollmentId;


        /*
         * Save it so other pages can use it.
         */

        localStorage.setItem(
            "studentEnrollmentId",
            enrollmentId
        );


        console.log(
            "Automatically filled Enrollment ID:",
            enrollmentId
        );

    }

}



/* =========================================================
   EXTRACT ENROLLMENT ID FROM EMAIL
   ========================================================= */

/*
   Example:

   Email:
   2025csb001.ayan@students.iiests.ac.in

   split("@")[0]

   gives:

   2025csb001.ayan

   Then:

   split(".")[0]

   gives:

   2025csb001
*/

function extractEnrollmentId(email) {

    if (!email) {

        return "";

    }


    const username =
        email
            .trim()
            .split("@")[0];


    if (!username) {

        return "";

    }


    const enrollmentId =
        username
            .split(".")[0];


    return enrollmentId.trim();

}



/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(
            inputId
        );


    if (!input) {

        return;

    }


    if (
        input.type === "password"
    ) {

        input.type =
            "text";


        button.classList.add(
            "show-password"
        );


        button.setAttribute(
            "aria-label",
            "Hide password"
        );

    }

    else {

        input.type =
            "password";


        button.classList.remove(
            "show-password"
        );


        button.setAttribute(
            "aria-label",
            "Show password"
        );

    }

}



/* =========================================================
   PASSWORD ELEMENTS
   ========================================================= */

const createPasswordInput =
    document.getElementById(
        "create-password"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirm-password"
    );


const passwordMatchCheck =
    document.getElementById(
        "password-match-check"
    );


const passwordMessage =
    document.getElementById(
        "password-message"
    );



/* =========================================================
   PASSWORD MATCH CHECK
   ========================================================= */

function checkPasswordMatch() {

    if (
        !createPasswordInput ||
        !confirmPasswordInput
    ) {

        return;

    }


    const password =
        createPasswordInput.value;


    const confirmPassword =
        confirmPasswordInput.value;



    /* =====================================================
       CONFIRM PASSWORD EMPTY
       ===================================================== */

    if (
        confirmPassword === ""
    ) {

        passwordMatchCheck.classList.remove(
            "visible"
        );


        passwordMessage.textContent =
            "";


        return;

    }



    /* =====================================================
       PASSWORDS MATCH
       ===================================================== */

    if (
        password === confirmPassword
    ) {

        passwordMatchCheck.classList.add(
            "visible"
        );


        passwordMessage.textContent =
            "";

    }



    /* =====================================================
       PASSWORDS DON'T MATCH
       ===================================================== */

    else {

        passwordMatchCheck.classList.remove(
            "visible"
        );


        passwordMessage.textContent =
            "Passwords do not match.";

    }

}



/* =========================================================
   PASSWORD INPUT EVENTS
   ========================================================= */

if (
    createPasswordInput
) {

    createPasswordInput.addEventListener(
        "input",
        checkPasswordMatch
    );

}


if (
    confirmPasswordInput
) {

    confirmPasswordInput.addEventListener(
        "input",
        checkPasswordMatch
    );

}



/* =========================================================
   PROGRAMME ELEMENTS
   ========================================================= */

const programmeSelect =
    document.getElementById(
        "programme-select"
    );


const programmeDisplay =
    document.getElementById(
        "programme-display"
    );


const programmeText =
    document.getElementById(
        "programme-text"
    );


const programmeInput =
    document.getElementById(
        "programme"
    );


const programmeMenu =
    document.getElementById(
        "programme-menu"
    );



/* =========================================================
   DEPARTMENT ELEMENTS
   ========================================================= */

const departmentSelect =
    document.getElementById(
        "department-select"
    );


const departmentDisplay =
    document.getElementById(
        "department-display"
    );


const departmentText =
    document.getElementById(
        "department-text"
    );


const departmentInput =
    document.getElementById(
        "department"
    );


const departmentMenu =
    document.getElementById(
        "department-menu"
    );


const departmentNote =
    document.getElementById(
        "department-note"
    );



/* =========================================================
   PROGRAMME DROPDOWN
   ========================================================= */

if (
    programmeDisplay
) {

    programmeDisplay.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (
                programmeSelect
            ) {

                programmeSelect.classList.toggle(
                    "open"
                );

            }


            if (
                departmentSelect
            ) {

                departmentSelect.classList.remove(
                    "open"
                );

            }

        }
    );

}



/* =========================================================
   PROGRAMME OPTIONS
   ========================================================= */

if (
    programmeMenu
) {

    const programmeOptions =
        programmeMenu.querySelectorAll(
            ".select-option"
        );


    programmeOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    const value =
                        this.dataset.value;


                    const text =
                        this.textContent.trim();


                    /*
                     * Save programme.
                     */

                    if (
                        programmeInput
                    ) {

                        programmeInput.value =
                            value;

                    }


                    /*
                     * Display programme.
                     */

                    if (
                        programmeText
                    ) {

                        programmeText.textContent =
                            text;

                    }


                    /*
                     * Remove previous selection.
                     */

                    programmeOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    /*
                     * Mark selected option.
                     */

                    this.classList.add(
                        "selected"
                    );


                    /*
                     * Close programme dropdown.
                     */

                    if (
                        programmeSelect
                    ) {

                        programmeSelect.classList.remove(
                            "open"
                        );

                    }


                    /*
                     * Update departments.
                     */

                    updateDepartments(
                        value
                    );

                }
            );

        }
    );

}



/* =========================================================
   UPDATE DEPARTMENTS
   ========================================================= */

function updateDepartments(
    programme
) {

    if (
        !departmentMenu
    ) {

        return;

    }


    /*
     * Remove old departments.
     */

    departmentMenu.innerHTML =
        "";


    /*
     * Reset selected department.
     */

    if (
        departmentInput
    ) {

        departmentInput.value =
            "";

    }


    if (
        departmentText
    ) {

        departmentText.textContent =
            "Select Department";

    }


    /*
     * Get departments.
     */

    const departmentList =
        programmeDepartments[
            programme
        ] || [];



    /* =====================================================
       CREATE DEPARTMENT OPTIONS
       ===================================================== */

    departmentList.forEach(
        function (department) {

            const option =
                document.createElement(
                    "button"
                );


            option.type =
                "button";


            option.className =
                "select-option";


            option.dataset.value =
                department;


            option.textContent =
                department;



            /* =============================================
               DEPARTMENT CLICK
               ============================================= */

            option.addEventListener(
                "click",
                function () {

                    /*
                     * Save department.
                     */

                    if (
                        departmentInput
                    ) {

                        departmentInput.value =
                            department;

                    }


                    /*
                     * Display department.
                     */

                    if (
                        departmentText
                    ) {

                        departmentText.textContent =
                            department;

                    }


                    /*
                     * Remove previous selection.
                     */

                    departmentMenu
                        .querySelectorAll(
                            ".select-option"
                        )
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    /*
                     * Mark selected.
                     */

                    this.classList.add(
                        "selected"
                    );


                    /*
                     * Close dropdown.
                     */

                    if (
                        departmentSelect
                    ) {

                        departmentSelect.classList.remove(
                            "open"
                        );

                    }

                }
            );


            departmentMenu.appendChild(
                option
            );

        }
    );



    /* =====================================================
       ENABLE DEPARTMENT DROPDOWN
       ===================================================== */

    if (
        departmentDisplay
    ) {

        departmentDisplay.disabled =
            false;

    }


    if (
        departmentSelect
    ) {

        departmentSelect.classList.remove(
            "disabled-select"
        );

    }



    /* =====================================================
       DEPARTMENT INFORMATION
       ===================================================== */

    if (
        departmentNote
    ) {

        if (
            programme === "Dual BS-MS"
        ) {

            departmentNote.textContent =
                "Available departments: Applied Geology, Physics and Chemistry.";

        }

        else if (
            programme === "B.Arch"
        ) {

            departmentNote.textContent =
                "Available department: Architecture and Planning.";

        }

        else {

            departmentNote.textContent =
                "Select your department from the available options.";

        }

    }

}



/* =========================================================
   DEPARTMENT DROPDOWN
   ========================================================= */

if (
    departmentDisplay
) {

    departmentDisplay.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            /*
             * Don't open if disabled.
             */

            if (
                departmentDisplay.disabled
            ) {

                return;

            }


            departmentSelect.classList.toggle(
                "open"
            );


            if (
                programmeSelect
            ) {

                programmeSelect.classList.remove(
                    "open"
                );

            }

        }
    );

}



/* =========================================================
   CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function () {

        if (
            programmeSelect
        ) {

            programmeSelect.classList.remove(
                "open"
            );

        }


        if (
            departmentSelect
        ) {

            departmentSelect.classList.remove(
                "open"
            );

        }

    }
);



/* =========================================================
   SUBMIT STUDENT DETAILS
   ========================================================= */

function submitStudentDetails(
    event
) {

    event.preventDefault();



    /* =====================================================
       GET VALUES
       ===================================================== */

    const fullName =
        document
            .getElementById(
                "full-name"
            )
            .value
            .trim();


    const enrollmentId =
        document
            .getElementById(
                "enrollment-id"
            )
            .value
            .trim();


    const createPassword =
        document
            .getElementById(
                "create-password"
            )
            .value;


    const confirmPassword =
        document
            .getElementById(
                "confirm-password"
            )
            .value;


    const programme =
        document
            .getElementById(
                "programme"
            )
            .value;


    const department =
        document
            .getElementById(
                "department"
            )
            .value;


    const phoneNumber =
        document
            .getElementById(
                "phone-number"
            )
            .value
            .trim();



    /* =====================================================
       NAME VALIDATION
       ===================================================== */

    if (
        fullName === ""
    ) {

        alert(
            "Please enter your full name."
        );


        document
            .getElementById(
                "full-name"
            )
            .focus();


        return;

    }



    /* =====================================================
       ENROLLMENT ID VALIDATION
       ===================================================== */

    if (
        enrollmentId === ""
    ) {

        alert(
            "Enrollment ID could not be loaded. Please verify your college email again."
        );


        return;

    }



    /* =====================================================
       PASSWORD VALIDATION
       ===================================================== */

    if (
        createPassword === ""
    ) {

        alert(
            "Please create a password."
        );


        createPasswordInput.focus();


        return;

    }


    /*
     * Minimum 8 characters.
     */

    if (
        createPassword.length < 8
    ) {

        alert(
            "Password must contain at least 8 characters."
        );


        createPasswordInput.focus();


        return;

    }



    /* =====================================================
       CONFIRM PASSWORD
       ===================================================== */

    if (
        createPassword !==
        confirmPassword
    ) {

        alert(
            "Create Password and Confirm Password do not match."
        );


        confirmPasswordInput.focus();


        return;

    }



    /* =====================================================
       PROGRAMME
       ===================================================== */

    if (
        programme === ""
    ) {

        alert(
            "Please select a programme."
        );


        return;

    }



    /* =====================================================
       DEPARTMENT
       ===================================================== */

    if (
        department === ""
    ) {

        alert(
            "Please select a department."
        );


        return;

    }



    /*
     * PHONE NUMBER
     *
     * No validation.
     */



    /* =====================================================
       CREATE STUDENT DATA
       ===================================================== */

    const studentData = {

        fullName:
            fullName,

        enrollmentId:
            enrollmentId,

        programme:
            programme,

        department:
            department,

        phoneNumber:
            phoneNumber

    };



    /* =====================================================
       SAVE STUDENT DATA
       ===================================================== */

    localStorage.setItem(
        "studentDetails",
        JSON.stringify(
            studentData
        )
    );


    localStorage.setItem(
        "studentName",
        fullName
    );


    localStorage.setItem(
        "studentEnrollmentId",
        enrollmentId
    );


    localStorage.setItem(
        "studentProgramme",
        programme
    );


    localStorage.setItem(
        "studentDepartment",
        department
    );


    localStorage.setItem(
        "studentPhone",
        phoneNumber
    );



    /*
     * Frontend prototype only.
     *
     * Do not store real passwords in
     * localStorage in a production system.
     */

    localStorage.setItem(
        "studentPassword",
        createPassword
    );



    /* =====================================================
       SHOW ACCOUNT CREATED MESSAGE
       ===================================================== */

    showSuccessPopup(
        fullName
    );

}



/* =========================================================
   SUCCESS POPUP
   ========================================================= */

function showSuccessPopup(
    fullName
) {

    /*
     * Create overlay.
     */

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "success-overlay";



    /*
     * Create popup.
     */

    overlay.innerHTML = `

        <div class="success-popup">

            <div class="success-icon">
                ✓
            </div>

            <h2>
                Account Created Successfully!
            </h2>

            <p>
                Welcome, ${escapeHTML(fullName)}!
            </p>

            <p class="redirect-message">

                Redirecting to dashboard in
                <span id="redirect-countdown">
                    5
                </span>
                seconds...

            </p>

        </div>

    `;



    /*
     * Add popup.
     */

    document.body.appendChild(
        overlay
    );



    /* =====================================================
       5 SECOND COUNTDOWN
       ===================================================== */

    let seconds = 5;


    const countdown =
        document.getElementById(
            "redirect-countdown"
        );


    const timer =
        setInterval(
            function () {

                seconds--;


                if (
                    countdown
                ) {

                    countdown.textContent =
                        seconds;

                }


                /*
                 * Redirect after 5 seconds.
                 */

                if (
                    seconds <= 0
                ) {

                    clearInterval(
                        timer
                    );


                    /*
                     * Student Details folder:
                     *
                     * pages/student-details/
                     *
                     * Dashboard folder:
                     *
                     * pages/dashboard/
                     */

                    window.location.href =
                        "../dashboard/dashboard.html";

                }

            },
            1000
        );

}



/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}



/* =========================================================
   BACK BUTTON
   ========================================================= */

function goBack() {

    window.history.back();

}