/*==================================================
        IIEST SHIBPUR - SIGNUP PAGE WIZARD JS
==================================================*/

const API_BASE = "http://localhost:5000/api/auth";

/* --- DOM Elements --- */
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const backBtn = document.getElementById("backBtn");
const stepTitle = document.getElementById("stepTitle");
const stepSubtitle = document.getElementById("stepSubtitle");

const emailInput = document.getElementById("email");
const generateOtpBtn = document.getElementById("generate-otp-btn");

const otpInput = document.getElementById("otp");
const verifyOtpBtn = document.getElementById("verify-otp-btn");
const timerText = document.getElementById("timerText");
const countdownEl = document.getElementById("countdown");
const resendOtpBtn = document.getElementById("resendOtpBtn");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const declaration = document.getElementById("declaration");
const submitBtn = document.getElementById("submit-btn");

const otpStatus = document.getElementById("otp-status");
const successModal = document.getElementById("success-modal");
const togglePasswordBtns = document.querySelectorAll(".toggle-password-btn");

/* --- State --- */
let currentStep = 1;
let verificationToken = null;
let resendTimer = null;
let isPasswordStrong = false;

/* --- Helpers --- */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(message, isError = true) {
    otpStatus.textContent = message;
    otpStatus.className = isError ? "otp-status otp-status--error" : "otp-status otp-status--success";
}

function clearStatus() {
    otpStatus.textContent = "";
}

function setStep(step) {
    currentStep = step;
    clearStatus();
    step1.classList.add("d-none");
    step2.classList.add("d-none");
    step3.classList.add("d-none");

    if (step === 1) {
        stepTitle.textContent = "Create Account";
        stepSubtitle.textContent = "Register using your official IIEST student email";
        step1.classList.remove("d-none");
        emailInput.focus();
    } else if (step === 2) {
        stepTitle.textContent = "Verify Email";
        stepSubtitle.textContent = `Code sent to ${emailInput.value.trim()}`;
        step2.classList.remove("d-none");
        otpInput.value = "";
        otpInput.focus();
        startResendTimer();
    } else if (step === 3) {
        stepTitle.textContent = "Complete Profile";
        stepSubtitle.textContent = "Set up your credentials";
        step3.classList.remove("d-none");
        passwordInput.focus();
    }
}

/* --- Back Button Logic --- */
backBtn.addEventListener("click", () => {
    if (currentStep === 1) {
        window.location.href = "index.html"; 
    } else if (currentStep === 2) {
        clearInterval(resendTimer);
        setStep(1); 
    } else if (currentStep === 3) {
        if (confirm("Going back will reset your verification. Are you sure?")) setStep(1);
    }
});

/* ==============================
        STEP 1: SEND OTP
============================== */
// Ensure only one listener is attached
generateOtpBtn.onclick = sendOtpRequest;
resendOtpBtn.onclick = sendOtpRequest;

async function sendOtpRequest() {
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) return showStatus("Enter a valid email address.");

    const btn = currentStep === 1 ? generateOtpBtn : resendOtpBtn;
    
    // Anti-Double-Click Protection
    if (btn.disabled) return; 

    btn.disabled = true;
    btn.classList.add("loading");
    clearStatus();

    try {
        const res = await fetch(`${API_BASE}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        let data;
        try { data = await res.json(); } catch(e) { data = { error: "Rate limit or server error." }; }
        
        btn.classList.remove("loading");
        
        if (!res.ok) {
            btn.disabled = false;
            return showStatus(data.error || "Could not send OTP.");
        }

        if (currentStep === 1) setStep(2);
        else startResendTimer();

    } catch (err) {
        console.error("Frontend Fetch Error:", err);
        btn.disabled = false;
        btn.classList.remove("loading");
        showStatus("Network error. Please check your connection.");
    }
}

/* --- Resend Timer --- */
function startResendTimer() {
    clearInterval(resendTimer);
    resendOtpBtn.classList.add("d-none");
    timerText.classList.remove("d-none");
    
    let timeLeft = 30;
    countdownEl.textContent = `${timeLeft}s`;

    resendTimer = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(resendTimer);
            timerText.classList.add("d-none");
            resendOtpBtn.disabled = false;
            resendOtpBtn.classList.remove("d-none");
        }
    }, 1000);
}

/* ==============================
        STEP 2: VERIFY OTP
============================== */
verifyOtpBtn.onclick = async () => {
    if (verifyOtpBtn.disabled) return; // Anti-Double-Click

    const otp = otpInput.value.trim();
    if (otp.length < 6) return showStatus("Enter the 6-digit OTP.");

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.classList.add("loading");
    clearStatus();

    try {
        const res = await fetch(`${API_BASE}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailInput.value.trim(), otp }),
        });

        let data;
        try { data = await res.json(); } catch(e) { data = { error: "Rate limit or server error." }; }

        verifyOtpBtn.classList.remove("loading");
        
        if (!res.ok) {
            verifyOtpBtn.disabled = false;
            return showStatus(data.error || "Incorrect OTP.");
        }

        verificationToken = data.verificationToken;
        clearInterval(resendTimer);
        setStep(3);

    } catch (err) {
        console.error("Frontend Fetch Error:", err);
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.classList.remove("loading");
        showStatus("Network error. Please check your connection.");
    }
};

/* ==============================
      STEP 3: PASSWORD VALIDATION
============================== */
passwordInput.addEventListener("input", (e) => {
    const val = e.target.value;
    const rules = {
        length: val.length >= 8,
        upper: /[A-Z]/.test(val),
        number: /[0-9]/.test(val),
        symbol: /[!@#$%^&*.,<>?]/.test(val)
    };

    updateRuleUI("rule-length", rules.length);
    updateRuleUI("rule-upper", rules.upper);
    updateRuleUI("rule-number", rules.number);
    updateRuleUI("rule-symbol", rules.symbol);

    isPasswordStrong = rules.length && rules.upper && rules.number && rules.symbol;
});

function updateRuleUI(elementId, isValid) {
    const el = document.getElementById(elementId);
    const icon = el.querySelector("i");
    if (isValid) {
        el.classList.add("valid");
        icon.className = "fa-solid fa-circle-check";
    } else {
        el.classList.remove("valid");
        icon.className = "fa-solid fa-circle-xmark";
    }
}

togglePasswordBtns.forEach(btn => {
    btn.onclick = function() {
        const input = this.previousElementSibling; 
        const icon = this.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.className = "fa-solid fa-eye-slash";
        } else {
            input.type = "password";
            icon.className = "fa-solid fa-eye";
        }
    };
});

/* ==============================
      STEP 3: SUBMIT REGISTRATION
============================== */
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (currentStep !== 3 || submitBtn.disabled) return;

    if (!isPasswordStrong) return showStatus("Please meet all password requirements.");
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.focus();
        return showStatus("Passwords do not match.");
    }
    if (!declaration.checked) return showStatus("You must accept the declaration.");

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    clearStatus();

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value,
                confirmPassword: confirmPasswordInput.value,
                verificationToken,
            }),
        });

        const data = await res.json();
        submitBtn.classList.remove("loading");

        if (!res.ok) {
            submitBtn.disabled = false;
            return showStatus(data.error || "Could not register. Please try again.");
        }

        successModal.hidden = false;

    } catch (err) {
        console.error("Frontend Registration Error:", err);
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        showStatus("Network error. Please check your connection.");
    }
});