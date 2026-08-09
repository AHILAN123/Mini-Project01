/* =========================================
   STUDENT EMAIL VERIFICATION
   ========================================= */


/* =========================================
   SEND OTP
   ========================================= */

function sendOTP() {

    const emailInput =
        document.getElementById("student-email");

    const email =
        emailInput.value.trim();


    /* =========================================
       CHECK EMPTY
       ========================================= */

    if (email === "") {

        alert("Please enter your student email.");

        emailInput.focus();

        return;
    }


    /* =========================================
       CHECK LOWERCASE
       ========================================= */

    if (email !== email.toLowerCase()) {

        alert(
            "Student email must be in lowercase.\n\n" +
            "Example:\n" +
            "2025csb001.ayan@students.iiests.ac.in"
        );

        emailInput.focus();

        return;
    }


    /* =========================================
       STUDENT EMAIL FORMAT

       4 digits  = Year
       3 letters = Department
       3 digits  = Roll Number
       .
       lowercase name
       @students.iiests.ac.in

       Example:

       2025csb001.ayan@students.iiests.ac.in
       ========================================= */

    const emailPattern =
        /^\d{4}[a-z]{3}\d{3}\.[a-z]+@students\.iiests\.ac\.in$/;


    /* =========================================
       CHECK EMAIL FORMAT
       ========================================= */

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

            "2025csb001.ayan@students.iiests.ac.in"
        );

        emailInput.focus();

        return;
    }


    /* =========================================
       VALID EMAIL
       ========================================= */

    console.log(
        "Valid Student Email:",
        email
    );


    /*
       TEMPORARY:

       At this stage we are not actually
       sending an email.

       Later this function will connect
       to your backend/email service.
    */


    /* =========================================
       SHOW OTP SECTION
       ========================================= */

    const otpSection =
        document.getElementById("otp-section");

    otpSection.style.display = "block";


    /* =========================================
       HIDE SEND OTP BUTTON
       ========================================= */

    const sendButton =
        document.getElementById("send-otp-btn");

    sendButton.style.display = "none";


    /* =========================================
       FOCUS OTP INPUT
       ========================================= */

    const otpInput =
        document.getElementById("otp");

    otpInput.focus();


    /* =========================================
       START RESEND TIMER
       ========================================= */

    startResendTimer();
}



/* =========================================
   OTP PLACEHOLDER
   ========================================= */

const otpInput =
    document.getElementById("otp");

const otpPlaceholder =
    document.getElementById("otp-placeholder");


if (otpInput && otpPlaceholder) {

    otpInput.addEventListener("input", function () {

        if (otpInput.value.length > 0) {

            otpInput.parentElement.classList.add(
                "has-value"
            );

        } else {

            otpInput.parentElement.classList.remove(
                "has-value"
            );

        }

    });

}



/* =========================================
   VERIFY OTP
   ========================================= */

function verifyOTP() {

    const otpInput =
        document.getElementById("otp");

    const otp =
        otpInput.value.trim();


    /* =========================================
       CHECK EMPTY
       ========================================= */

    if (otp === "") {

        alert("Please enter the OTP.");

        otpInput.focus();

        return;
    }


    /* =========================================
       CHECK OTP LENGTH AND FORMAT
       ========================================= */

    if (!/^\d{6}$/.test(otp)) {

        alert(
            "Please enter a valid 6-digit OTP."
        );

        otpInput.focus();

        return;
    }


    /*
       =========================================
       TEMPORARY SUCCESS

       For now, any valid 6-digit OTP is
       treated as successfully verified.

       Later, the backend will check whether
       the OTP is actually correct.
       =========================================
    */


    console.log(
        "OTP verified:",
        otp
    );


    /* =========================================
       HIDE EMAIL SECTION
       ========================================= */

    const emailSection =
        document.getElementById("email-section");

    emailSection.style.display = "none";


    /* =========================================
       HIDE OTP SECTION
       ========================================= */

    const otpSection =
        document.getElementById("otp-section");

    otpSection.style.display = "none";


    /* =========================================
       HIDE SEND OTP BUTTON
       ========================================= */

    const sendButton =
        document.getElementById("send-otp-btn");

    sendButton.style.display = "none";


    /* =========================================
       SHOW VERIFIED SUCCESS
       ========================================= */

    const successSection =
        document.getElementById(
            "verification-success"
        );

    successSection.style.display = "block";

}



/* =========================================
   RESEND OTP
   ========================================= */

function resendOTP() {

    const emailInput =
        document.getElementById("student-email");

    const email =
        emailInput.value.trim();


    /* =========================================
       CHECK EMAIL
       ========================================= */

    if (email === "") {

        alert(
            "Please enter your student email."
        );

        emailInput.focus();

        return;
    }


    /* =========================================
       CHECK LOWERCASE
       ========================================= */

    if (email !== email.toLowerCase()) {

        alert(
            "Student email must be in lowercase."
        );

        emailInput.focus();

        return;
    }


    /* =========================================
       CHECK EMAIL FORMAT
       ========================================= */

    const emailPattern =
        /^\d{4}[a-z]{3}\d{3}\.[a-z]+@students\.iiests\.ac\.in$/;


    if (!emailPattern.test(email)) {

        alert(
            "Invalid student email format.\n\n" +
            "Example:\n" +
            "2025csb001.ayan@students.iiests.ac.in"
        );

        emailInput.focus();

        return;
    }


    /* =========================================
       TEMPORARY RESEND
       ========================================= */

    console.log(
        "New OTP sent to:",
        email
    );


    alert(
        "A new OTP has been sent."
    );


    /* =========================================
       RESTART TIMER
       ========================================= */

    startResendTimer();

}



/* =========================================
   RESEND OTP TIMER
   ========================================= */

function startResendTimer() {

    const resendText =
        document.getElementById("resend-text");


    let seconds = 30;


    /* =========================================
       SHOW TIMER
       ========================================= */

    resendText.innerHTML =
        `Didn't receive the OTP?
        <span id="timer">
            Resend OTP in ${seconds}s
        </span>`;


    /* =========================================
       COUNTDOWN
       ========================================= */

    const timer =
        setInterval(function () {

            seconds--;


            const timerElement =
                document.getElementById("timer");


            if (seconds > 0) {

                timerElement.textContent =
                    `Resend OTP in ${seconds}s`;

            } else {

                clearInterval(timer);


                resendText.innerHTML =
                    `Didn't receive the OTP?
                    <button
                        type="button"
                        class="resend-btn"
                        onclick="resendOTP()">
                        Resend OTP
                    </button>`;

            }

        }, 1000);

}



/* =========================================
   CONTINUE TO STUDENT DETAILS
   ========================================= */

function continueToStudentDetails() {

    /*
       Student Details is in a separate folder.

       Expected structure:

       Project/
       │
       ├── Email Verification Window/
       │   ├── emailv.html
       │   ├── emailv.css
       │   └── emailv.js
       │
       └── Student Details window/
           ├── studentdtls.html
           ├── studentdtls.css
           └── studentdtls.js
    */

    window.location.href =
        "../Student Details window/studentdtls.html";

}



/* =========================================
   BACK BUTTON
   ========================================= */

function goBack() {

    window.history.back();

}