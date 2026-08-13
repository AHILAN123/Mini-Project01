/*==================================================
        IIEST SHIBPUR
Semester Registration Portal; SIGNUP.JS
==================================================*/

/*==============================
        API BASE
==============================*/
const API_BASE = "http://localhost:5000/api/auth";

/*==============================
        DOM ELEMENTS
==============================*/
const signupForm = document.getElementById("signup-form");

const emailInput = document.getElementById("email");
const generateOtpBtn = document.getElementById("generate-otp-btn");

const otpInput = document.getElementById("otp");
const verifyOtpBtn = document.getElementById("verify-otp-btn");
const otpStatus = document.getElementById("otp-status");

const lockedGroups = [
    document.getElementById("password-group"),
    document.getElementById("confirm-password-group"),
    document.getElementById("fullname-group"),
    document.getElementById("mobile-group"),
];

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const fullnameInput = document.getElementById("fullname");
const mobileInput = document.getElementById("mobile");
const submitBtn = document.getElementById("submit-btn");

const passwordIcon = document.getElementById("password-icon");
const confirmPasswordIcon = document.getElementById("confirm-password-icon");
const togglePasswordBtns = document.querySelectorAll(".toggle-password-btn");

const successModal = document.getElementById("success-modal");

let verificationToken = null; 
let otpVerified = false;

/*==============================
        HELPER FUNCTIONS
==============================*/
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showStatus(message, isError = true) {
    otpStatus.textContent = message;
    otpStatus.className = isError ? "otp-status otp-status--error" : "otp-status otp-status--success";
}

/*==============================
        STEP 1: GENERATE OTP
==============================*/
generateOtpBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        showStatus("Enter a valid email first.");
        emailInput.focus();
        return;
    }

    generateOtpBtn.disabled = true;
    generateOtpBtn.classList.add("loading");
    otpStatus.textContent = "";
    otpStatus.className = "otp-status";

    try {
        const res = await fetch(`${API_BASE}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Server returned a non-JSON response.");
        }

        const data = await res.json();

        if (!res.ok) {
            showStatus(data.error || "Could not send OTP.");
            generateOtpBtn.disabled = false;
            generateOtpBtn.classList.remove("loading");
            return;
        }

        otpInput.disabled = false;
        verifyOtpBtn.disabled = false;
        otpInput.focus();

        // Change text inside button, but remove loader so the text is visible
        generateOtpBtn.textContent = "Resend OTP";
        generateOtpBtn.disabled = false;
        generateOtpBtn.classList.remove("loading");

        showStatus("OTP sent to " + email + ".", false);

    } catch (err) {
        generateOtpBtn.disabled = false;
        generateOtpBtn.classList.remove("loading");
        if (err instanceof TypeError) {
            showStatus("Server error. Is the backend running properly?");
        } else {
            showStatus("Network error. Could not connect to the server.");
        }
    }
});

/*==============================
        STEP 2: VERIFY OTP
==============================*/
verifyOtpBtn.addEventListener("click", async () => {
    const enteredOtp = otpInput.value.trim();

    if (!enteredOtp) {
        showStatus("Enter the OTP you received.");
        return;
    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.classList.add("loading");

    try {
        const res = await fetch(`${API_BASE}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailInput.value.trim(), otp: enteredOtp }),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Server returned a non-JSON response.");
        }

        const data = await res.json();
        verifyOtpBtn.classList.remove("loading");

        if (!res.ok) {
            showStatus(data.error || "Incorrect OTP. Please try again.");
            verifyOtpBtn.disabled = false;
            return;
        }

        // ----- Unlock the rest of the form -----
        verificationToken = data.verificationToken;
        otpVerified = true;

        showStatus("Email verified.", false);

        otpInput.disabled = true;
        verifyOtpBtn.disabled = true;
        generateOtpBtn.disabled = true;
        emailInput.disabled = true;

        lockedGroups.forEach((group) => group.classList.remove("locked-group"));

        [passwordInput, confirmPasswordInput, fullnameInput, mobileInput].forEach(
            (input) => (input.disabled = false)
        );

        submitBtn.disabled = false;

        // Swap the lock icons for real show/hide password eyes
        passwordIcon.classList.remove("fa-lock");
        passwordIcon.classList.add("fa-eye");
        
        confirmPasswordIcon.classList.remove("fa-lock");
        confirmPasswordIcon.classList.add("fa-eye");

        fullnameInput.focus();

    } catch (err) {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.classList.remove("loading");
        if (err instanceof TypeError) {
            showStatus("Server error. Is the backend running properly?");
        } else {
            showStatus("Network error. Could not connect to the server.");
        }
    }
});

/*==============================
        SHOW / HIDE PASSWORD
==============================*/
togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        // Prevent toggling if form is still locked
        if (!otpVerified) return;

        const input = this.previousElementSibling; 
        const icon = this.querySelector("i");
        
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    });
});

/*==============================
        STEP 3: SUBMIT REGISTRATION
==============================*/
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!otpVerified) return; 

    if (passwordInput.value.length < 6) {
        showStatus("Password must be at least 6 characters.");
        passwordInput.focus();
        return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        showStatus("Passwords do not match.");
        confirmPasswordInput.focus();
        return;
    }

    if (fullnameInput.value.trim() === "") {
        showStatus("Enter your full name.");
        fullnameInput.focus();
        return;
    }

    if (!/^\d{10}$/.test(mobileInput.value.trim())) {
        showStatus("Enter a valid 10-digit mobile number.");
        mobileInput.focus();
        return;
    }

    const payload = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
        fullname: fullnameInput.value.trim(),
        mobile: mobileInput.value.trim(),
        verificationToken,
    };

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Server returned a non-JSON response.");
        }

        const data = await res.json();
        submitBtn.classList.remove("loading");

        if (!res.ok) {
            showStatus(data.error || "Could not register. Please try again.");
            submitBtn.disabled = false;
            return;
        }

        successModal.hidden = false;

    } catch (err) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        
        if (err instanceof TypeError) {
            showStatus("Server error. Is the backend running properly?");
        } else {
            showStatus("Network error. Could not connect to the server.");
        }
    }
});

/*==============================
        ACTIVE MENU
==============================*/
const nav = document.querySelectorAll(".top-menu a");
nav.forEach(item => {
    item.addEventListener("click", (e) => {
        if (item.getAttribute("href") === "#") {
            e.preventDefault();
        }
        nav.forEach(link => {
            link.classList.remove("active");
        });
        item.classList.add("active");
    });
});

/*==============================
        PAGE LOADED
==============================*/
window.addEventListener("load", () => {
    console.log("IIEST Signup Page Loaded");
});