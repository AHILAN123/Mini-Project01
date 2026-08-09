/* =========================================================
   EMAIL VERIFICATION JAVASCRIPT
   File: emailv.js

   CURRENT FRONTEND TEST VERSION

   Features:
   1. Student email format validation
   2. Lowercase validation
   3. OTP screen
   4. Test OTP
   5. Wrong OTP warning
   6. Resend OTP timer
   7. Back button
   8. Email verification alert
   9. Save verified email in localStorage
   10. Redirect to Student Details page

   IMPORTANT:
   - No database is being used.
   - No real email is being sent yet.
   - Test OTP = 123456
   ========================================================= */


/* =========================================================
   TEST OTP
   ========================================================= */

const TEST_OTP = "123456";


/* =========================================================
   STUDENT EMAIL FORMAT
   =========================================================

   Required format:

   <4 digit year>
   <3 lowercase department letters>
   <3 digit roll number>
   .
   <lowercase name>
   @students.iiests.ac.in

   Example:

   2026xyz001.thor@students.iiests.ac.in

   ========================================================= */

const emailPattern =
    /^\d{4}[a-z]{3}\d{3}\.[a-z]+@students\.iiests\.ac\.in$/;


/* =========================================================
   RESEND TIMER VARIABLE
   ========================================================= */

let resendTimer = null;


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const otpInput =
            document.getElementById("otp");


        /* ---------------------------------------------
           OTP INPUT

           Only numbers are allowed.
           --------------------------------------------- */

        otpInput.addEventListener(
            "input",
            function () {

                /* Remove anything other than numbers */

                otpInput.value =
                    otpInput.value.replace(
                        /\D/g,
                        ""
                    );


                /* -------------------------------------
                   Hide "Enter OTP..." while typing
                   ------------------------------------- */

                if (otpInput.value.length > 0) {

                    otpInput.parentElement.classList.add(
                        "has-value"
                    );

                } else {

                    otpInput.parentElement.classList.remove(
                        "has-value"
                    );

                }

            }
        );

    }
);


/* =========================================================
   SEND OTP
   ========================================================= */

function sendOTP() {

    const emailInput =
        document.getElementById(
            "student-email"
        );


    const email =
        emailInput.value.trim();


    /* =====================================================
       CHECK 1: EMPTY EMAIL
       ===================================================== */

    if (email === "") {

        alert(
            "Please enter your student email."
        );

        emailInput.focus();

        return;

    }


    /* =====================================================
       CHECK 2: LOWERCASE

       Student email must always be lowercase.
       ===================================================== */

    if (email !== email.toLowerCase()) {

        alert(
            "Student email must be in lowercase.\n\n" +

            "Example:\n" +

            "2026xyz001.thor@students.iiests.ac.in"
        );

        emailInput.focus();

        return;

    }


    /* =====================================================
       CHECK 3: EMAIL FORMAT
       ===================================================== */

    if (!emailPattern.test(email)) {

        alert(
            "Invalid student email format.\n\n" +

            "Required format:\n" +

            "<4-digit-year>" +
            "<3-letter-department>" +
            "<3-digit-rollno>" +
            ".<name>" +
            "@students.iiests.ac.in\n\n" +

            "Example:\n" +

            "2026xyz001.thor@students.iiests.ac.in"
        );

        emailInput.focus();

        return;

    }


    /* =====================================================
       EMAIL IS VALID
       =====================================================

       At the moment this is a frontend test.

       No actual email is sent.

       Test OTP = 123456
       ===================================================== */

    alert(
        "OTP has been sent to your student email.\n\n" +

        "For testing, use OTP: 123456"
    );


    /* =====================================================
       SHOW OTP SECTION
       ===================================================== */

    document.getElementById(
        "otp-section"
    ).style.display = "block";


    /* =====================================================
       HIDE SEND OTP BUTTON
       ===================================================== */

    document.getElementById(
        "send-otp-btn"
    ).style.display = "none";


    /* =====================================================
       FOCUS OTP INPUT
       ===================================================== */

    document.getElementById(
        "otp"
    ).focus();


    /* =====================================================
       START RESEND TIMER
       ===================================================== */

    startResendTimer();

}


/* =========================================================
   VERIFY OTP
   ========================================================= */

function verifyOTP() {

    const otpInput =
        document.getElementById("otp");


    const otp =
        otpInput.value.trim();


    const emailInput =
        document.getElementById(
            "student-email"
        );


    const email =
        emailInput.value.trim();


    /* =====================================================
       CHECK 1: EMPTY OTP
       ===================================================== */

    if (otp === "") {

        alert(
            "Please enter the OTP."
        );

        otpInput.focus();

        return;

    }


    /* =====================================================
       CHECK 2: OTP MUST CONTAIN 6 DIGITS
       ===================================================== */

    if (!/^\d{6}$/.test(otp)) {

        alert(
            "Please enter a valid 6-digit OTP."
        );

        otpInput.focus();

        return;

    }


    /* =====================================================
       CHECK 3: WRONG OTP
       ===================================================== */

    if (otp !== TEST_OTP) {

        alert(
            "Incorrect OTP.\n\n" +
            "Please enter the correct OTP."
        );

        otpInput.focus();

        return;

    }


    /* =====================================================
       OTP IS CORRECT
       ===================================================== */


    /* -----------------------------------------------------
       STOP RESEND TIMER
       ----------------------------------------------------- */

    if (resendTimer !== null) {

        clearInterval(resendTimer);

        resendTimer = null;

    }


    /* =====================================================
       SAVE VERIFIED EMAIL

       This stores the verified student's email in the
       browser's localStorage.

       Key:
       verifiedStudentEmail

       Value:
       The email entered by the student.

       Example stored value:

       2026xyz001.thor@students.iiests.ac.in

       The Student Details page can later retrieve it
       using:

       localStorage.getItem("verifiedStudentEmail");
       ===================================================== */

    localStorage.setItem(
        "verifiedStudentEmail",
        email
    );


    /* =====================================================
       OPTIONAL CONSOLE CHECK

       Open browser:
       F12 → Console

       You should see the verified email.
       ===================================================== */

    console.log(
        "Verified student email saved:",
        localStorage.getItem(
            "verifiedStudentEmail"
        )
    );


    /* =====================================================
       SHOW SUCCESS ALERT

       There is NO separate Verified window.

       The user simply gets an alert.
       ===================================================== */

    alert(
        "✓ Email verified successfully!"
    );


    /* =====================================================
       REDIRECT TO STUDENT DETAILS
       =====================================================

       Current expected folder structure:

       pages/
       │
       ├── email-verification/
       │   ├── emailv.html
       │   ├── emailv.css
       │   └── emailv.js
       │
       └── student-details/
           ├── studentdtls.html
           ├── studentdtls.css
           └── studentdtls.js

       ===================================================== */

    window.location.href =
        "../student-details/studentdtls.html";

}


/* =========================================================
   RESEND OTP
   ========================================================= */

function resendOTP() {

    const emailInput =
        document.getElementById(
            "student-email"
        );


    const email =
        emailInput.value.trim();


    /* =====================================================
       CHECK EMAIL
       ===================================================== */

    if (!emailPattern.test(email)) {

        alert(
            "Please enter a valid student email."
        );

        return;

    }


    /* =====================================================
       TEST RESEND

       No real email is being sent yet.
       ===================================================== */

    alert(
        "A new OTP has been sent.\n\n" +

        "For testing, use OTP: 123456"
    );


    /* =====================================================
       RESTART TIMER
       ===================================================== */

    startResendTimer();

}


/* =========================================================
   RESEND OTP TIMER
   ========================================================= */

function startResendTimer() {

    const resendText =
        document.getElementById(
            "resend-text"
        );


    /* =====================================================
       CLEAR OLD TIMER
       ===================================================== */

    if (resendTimer !== null) {

        clearInterval(resendTimer);

    }


    let seconds = 30;


    /* =====================================================
       INITIAL MESSAGE
       ===================================================== */

    resendText.innerHTML =
        `Didn't receive the OTP?
         <span id="timer">
         Resend OTP in ${seconds}s
         </span>`;


    /* =====================================================
       START COUNTDOWN
       ===================================================== */

    resendTimer =
        setInterval(
            function () {

                seconds--;


                const timer =
                    document.getElementById(
                        "timer"
                    );


                /* -----------------------------------------
                   Safety check
                   ----------------------------------------- */

                if (!timer) {

                    clearInterval(
                        resendTimer
                    );

                    resendTimer = null;

                    return;

                }


                /* -----------------------------------------
                   TIMER STILL RUNNING
                   ----------------------------------------- */

                if (seconds > 0) {

                    timer.textContent =
                        `Resend OTP in ${seconds}s`;

                }


                /* -----------------------------------------
                   TIMER FINISHED
                   ----------------------------------------- */

                else {

                    clearInterval(
                        resendTimer
                    );

                    resendTimer = null;


                    resendText.innerHTML =
                        `Didn't receive the OTP?

                        <button
                            type="button"
                            class="resend-btn"
                            onclick="resendOTP()">

                            Resend OTP

                        </button>`;

                }

            },
            1000
        );

}


/* =========================================================
   BACK BUTTON
   =========================================================

   Behaviour:

   EMAIL SCREEN
        ↓
   Send OTP
        ↓
   OTP SCREEN
        ↓
   Back
        ↓
   EMAIL SCREEN

   If already on the initial email screen,
   browser goes to the previous page.
   ========================================================= */

function goBack() {

    const otpSection =
        document.getElementById(
            "otp-section"
        );


    /* =====================================================
       IF OTP SCREEN IS OPEN
       ===================================================== */

    if (
        otpSection.style.display === "block"
    ) {


        /* ---------------------------------------------
           Stop timer
           --------------------------------------------- */

        if (resendTimer !== null) {

            clearInterval(
                resendTimer
            );

            resendTimer = null;

        }


        /* ---------------------------------------------
           Hide OTP section
           --------------------------------------------- */

        otpSection.style.display =
            "none";


        /* ---------------------------------------------
           Show Send OTP button
           --------------------------------------------- */

        document.getElementById(
            "send-otp-btn"
        ).style.display =
            "block";


        /* ---------------------------------------------
           Clear OTP
           --------------------------------------------- */

        const otpInput =
            document.getElementById(
                "otp"
            );


        otpInput.value = "";


        otpInput.parentElement.classList.remove(
            "has-value"
        );


        /* ---------------------------------------------
           Focus email field
           --------------------------------------------- */

        document.getElementById(
            "student-email"
        ).focus();


        return;

    }


    /* =====================================================
       INITIAL EMAIL SCREEN

       Go back to previous browser page.
       ===================================================== */

    window.history.back();

}