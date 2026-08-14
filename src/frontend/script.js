/*==================================================
        IIEST SHIBPUR
Semester Registration Portal; SCRIPT.JS
==================================================*/

const API_BASE = "http://localhost:5000/api/auth";

/* --- DOM Elements --- */
const standardLoginView = document.getElementById("standardLoginView");
const returningUserView = document.getElementById("returningUserView");

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMeCheckbox = document.getElementById("rememberMe");
const loginButton = document.querySelector(".login-btn");
const loginStatus = document.getElementById("loginStatus");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const capsLockWarning = document.getElementById("capsLockWarning");

const returningLoginForm = document.getElementById("returningLoginForm");
const returningAvatar = document.getElementById("returningAvatar");
const returningGreeting = document.getElementById("returningGreeting");
const returningEmail = document.getElementById("returningEmail");
const returningPassword = document.getElementById("returningPassword");
const returningLoginBtn = document.getElementById("returningLoginBtn");
const returningLoginStatus = document.getElementById("returningLoginStatus");
const returningForgotPasswordLink = document.getElementById("returningForgotPasswordLink");
const returningCapsLockWarning = document.getElementById("returningCapsLockWarning");
const switchAccountBtn = document.getElementById("switchAccountBtn");

const togglePasswordBtns = document.querySelectorAll(".toggle-password-btn");

/* --- Helper Functions --- */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(element, message, isError = true) {
    element.textContent = message;
    element.className = isError ? "login-status error" : "login-status success";
}

/* --- Helper Functions --- */
function getInitials(name) {
    if (!name) return "ST";
    const parts = name.trim().split(/[\s_.]+/);
    // Filter out parts that start with numbers (like roll numbers)
    const validParts = parts.filter(p => !/^\d/.test(p));
    
    if (validParts.length === 0) return name.substring(0, 2).toUpperCase();
    const initials = validParts.slice(0, 2).map(p => p[0]).join("");
    return initials.toUpperCase();
}

/* ==============================
        RETURNING USER INITIALIZATION
============================== */
let rememberedUser = null;
const storedUserRaw = localStorage.getItem("rememberedUser");

if (storedUserRaw) {
    try {
        rememberedUser = JSON.parse(storedUserRaw);
        showReturningUserUI(rememberedUser);
    } catch (e) {
        localStorage.removeItem("rememberedUser");
    }
}

function showReturningUserUI(user) {
    standardLoginView.classList.add("d-none");
    returningUserView.classList.remove("d-none");

    let displayName = user.fullname;
    
    // If fullname is missing or is the backend placeholder, extract it cleanly from the email
    if (!displayName || displayName === "Pending Admin Input" || displayName === "Institute Student") {
        const emailPrefix = user.email.split("@")[0]; // "2025csb013.jyotipada"
        const namePart = emailPrefix.split(".").pop(); // "jyotipada"
        // Capitalize the first letter
        displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1); 
    }

    returningGreeting.textContent = `Welcome back, ${displayName}!`;
    returningEmail.textContent = user.email;
    returningAvatar.textContent = getInitials(displayName); // Will now output "J" instead of "2J"
    returningPassword.value = "";
    returningPassword.focus();
}

function showStandardLoginUI() {
    returningUserView.classList.add("d-none");
    standardLoginView.classList.remove("d-none");
    emailInput.focus();
}

switchAccountBtn.addEventListener("click", () => {
    localStorage.removeItem("rememberedUser");
    rememberedUser = null;
    showStandardLoginUI();
});

/* ==============================
        PASSWORD VISIBILITY TOGGLE
============================== */
togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.className = "fa-solid fa-eye-slash";
        } else {
            input.type = "password";
            icon.className = "fa-solid fa-eye";
        }
    });
});

/* ==============================
        CAPS LOCK DETECTION
==============================*/
function bindCapsLock(inputEl, warningEl) {
    inputEl.addEventListener("keyup", (e) => {
        if (e.getModifierState("CapsLock")) {
            warningEl.classList.remove("d-none");
        } else {
            warningEl.classList.add("d-none");
        }
    });
    inputEl.addEventListener("blur", () => warningEl.classList.add("d-none"));
}
bindCapsLock(passwordInput, capsLockWarning);
bindCapsLock(returningPassword, returningCapsLockWarning);

/* ==============================
        STANDARD LOGIN
============================== */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginStatus.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "") return showStatus(loginStatus, "Please enter your email.");
    if (!isValidEmail(email)) return showStatus(loginStatus, "Please enter a valid email.");
    if (password === "") return showStatus(loginStatus, "Please enter your password.");

    loginButton.classList.add("loading");

    fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    .then(async (res) => {
        loginButton.classList.remove("loading");
        const data = await res.json();
        if (!res.ok) return showStatus(loginStatus, data.error || "Could not log in. Please try again.");

        if (rememberMeCheckbox.checked) {
            localStorage.setItem("rememberedUser", JSON.stringify({
                email: data.user.email,
                fullname: data.user.fullname
            }));
        } else {
            localStorage.removeItem("rememberedUser");
        }

        sessionStorage.setItem("sessionToken", data.sessionToken);
        sessionStorage.setItem("cachedUser", JSON.stringify(data.user));

        if (data.user.email === "teamsajark@gmail.com") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "dashboard.html";
        }
    })
    .catch(() => {
        loginButton.classList.remove("loading");
        showStatus(loginStatus, "Network error. Could not connect to server.");
    });
});

/* ==============================
        RETURNING USER LOGIN
============================== */
returningLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    returningLoginStatus.textContent = "";

    const password = returningPassword.value.trim();
    if (password === "") return showStatus(returningLoginStatus, "Please enter your password.");

    returningLoginBtn.classList.add("loading");

    fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: rememberedUser.email, password }),
    })
    .then(async (res) => {
        returningLoginBtn.classList.remove("loading");
        const data = await res.json();
        if (!res.ok) return showStatus(returningLoginStatus, data.error || "Incorrect password.");

        sessionStorage.setItem("sessionToken", data.sessionToken);
        sessionStorage.setItem("cachedUser", JSON.stringify(data.user));

        if (data.user.email === "teamsajark@gmail.com") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "dashboard.html";
        }
    })
    .catch(() => {
        returningLoginBtn.classList.remove("loading");
        showStatus(returningLoginStatus, "Network error. Could not connect to server.");
    });
});

/* ==============================
        FORGOT PASSWORD
============================== */
function handleForgotPassword(emailVal, statusEl) {
    if (!emailVal || !isValidEmail(emailVal)) {
        return showStatus(statusEl, "Enter your registered email above first.");
    }
    if (!confirm("Send a new password to " + emailVal + "?")) return;

    fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal }),
    })
    .then(async (res) => {
        const data = await res.json();
        showStatus(statusEl, data.message || "A temporary password was sent.", false);
    })
    .catch(() => showStatus(statusEl, "Network error while resetting password."));
}

forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    handleForgotPassword(emailInput.value.trim(), loginStatus);
});

returningForgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    handleForgotPassword(rememberedUser.email, returningLoginStatus);
});

/* ==============================
        ADMIN LOGIN TOGGLE
============================== */
const adminToggleLink = document.getElementById("adminToggleLink");
const loginTitle = document.querySelector(".login-card h2");
const loginSubtitle = document.querySelector(".login-card .login-subtitle");
const googleAuthSection = document.getElementById("googleAuthSection");
const emailLabel = document.querySelector('label[for="email"]');

let isAdminMode = false;

adminToggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isAdminMode = !isAdminMode;
    
    if (isAdminMode) {
        loginTitle.textContent = "Admin Login";
        loginSubtitle.textContent = "Sign in using your administrative credentials";
        emailLabel.textContent = "Admin Email";
        googleAuthSection.classList.add("d-none");
        adminToggleLink.innerHTML = "<i class='fa-solid fa-user-graduate'></i> Switch to Student Login";
    } else {
        loginTitle.textContent = "Student Login";
        loginSubtitle.textContent = "Sign in using your official IIEST student account";
        emailLabel.textContent = "Student Email";
        googleAuthSection.classList.remove("d-none");
        adminToggleLink.innerHTML = "<i class='fa-solid fa-user-shield'></i> Staff / Admin Login";
    }
});

/* ==============================
        GOOGLE AUTH & FALLBACK
==============================*/
const googleBtn = document.getElementById("customGoogleBtn");
const googleFallbackMsg = document.getElementById("googleFallbackMsg");
const GOOGLE_CLIENT_ID = "434219339029-91ji5n9gc3ki0jak207damkkh6d5jqqu.apps.googleusercontent.com";
let tokenClient;

function loadGoogleScript() {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "email profile",
            callback: handleGoogleAuthResponse,
        });
    };
    script.onerror = () => {
        googleBtn.disabled = true;
        googleBtn.style.opacity = "0.5";
        googleFallbackMsg.textContent = "Google Login is blocked by your browser extensions.";
        googleFallbackMsg.className = "login-status error text-center mt-2";
        googleFallbackMsg.classList.remove("d-none");
    };
    document.head.appendChild(script);
}
loadGoogleScript();

googleBtn.addEventListener("click", () => {
    if (tokenClient) tokenClient.requestAccessToken();
});

function handleGoogleAuthResponse(response) {
    if (response.error) return showStatus(loginStatus, "Google authentication was cancelled.");

    googleBtn.classList.add("loading");
    showStatus(loginStatus, "Authenticating with Google...", false);

    fetch(`${API_BASE}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: response.access_token }),
    })
    .then(async (res) => {
        googleBtn.classList.remove("loading");
        const data = await res.json();
        if (!res.ok) return showStatus(loginStatus, data.error || "Google authentication failed.");

        sessionStorage.setItem("sessionToken", data.sessionToken);
        sessionStorage.setItem("cachedUser", JSON.stringify(data.user));

        if (data.user.email === "teamsajark@gmail.com") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "dashboard.html";
        }
    })
    .catch(() => {
        googleBtn.classList.remove("loading");
        showStatus(loginStatus, "Network error during Google login.");
    });
}

/* ==============================
        INFO MODALS (ABOUT / CONTACT)
==============================*/
const aboutBtn = document.getElementById("aboutBtn");
const contactBtn = document.getElementById("contactBtn");
const aboutModal = document.getElementById("aboutModal");
const contactModal = document.getElementById("contactModal");
const closeBtns = document.querySelectorAll(".info-modal-close");

if (aboutBtn && contactBtn) {
    aboutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        aboutModal.classList.add("active");
    });
    contactBtn.addEventListener("click", (e) => {
        e.preventDefault();
        contactModal.classList.add("active");
    });
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            aboutModal.classList.remove("active");
            contactModal.classList.remove("active");
        });
    });
    window.addEventListener("click", (e) => {
        if (e.target === aboutModal) aboutModal.classList.remove("active");
        if (e.target === contactModal) contactModal.classList.remove("active");
    });
}