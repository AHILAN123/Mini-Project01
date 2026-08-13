/*==================================================
        IIEST SHIBPUR
Semester Registration Portal; SCRIPT.JS
==================================================*/

/*==============================
        API BASE
==============================*/
const API_BASE = "http://localhost:5000/api/auth";

/*==============================
        DOM ELEMENTS
==============================*/
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.querySelector(".toggle-password-btn");
const togglePasswordIcon = document.getElementById("togglePasswordIcon");
const loginButton = document.querySelector(".login-btn");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

/*==============================
        SHOW PASSWORD
==============================*/
togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordIcon.classList.remove("fa-eye");
        togglePasswordIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        togglePasswordIcon.classList.remove("fa-eye-slash");
        togglePasswordIcon.classList.add("fa-eye");
    }
});

/*==============================
        EMAIL VALIDATION
==============================*/
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const loginStatus = document.getElementById("loginStatus");

function showStatus(message, isError = true) {
    loginStatus.textContent = message;
    loginStatus.className = isError ? "login-status error" : "login-status success";
}

/*==============================
        LOGIN
==============================*/
form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginStatus.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "") return showStatus("Please enter your email.");
    if (!isValidEmail(email)) return showStatus("Please enter a valid email.");
    if (password === "") return showStatus("Please enter your password.");

    loginButton.classList.add("loading");

    fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    .then(async (res) => {
        loginButton.classList.remove("loading");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Server returned a non-JSON response.");
        }

        const data = await res.json();
        if (!res.ok) return showStatus(data.error || "Could not log in. Please try again.");

        sessionStorage.setItem("sessionToken", data.sessionToken);
        sessionStorage.setItem("cachedUser", JSON.stringify(data.user));
        window.location.href = "dashboard.html";
    })
    .catch((err) => {
        loginButton.classList.remove("loading");
        if (err instanceof TypeError) {
            showStatus("Server error. Is the backend running properly?");
        } else {
            showStatus("Network error. Could not connect to the server.");
        }
    });
});

/*==============================
        GOOGLE LOGIN HANDLER
==============================*/
window.handleGoogleLogin = function(response) {
    const jwtToken = response.credential;
    showStatus("Authenticating with Google...", false);
    
    // NOTE: This requires your backend to have a /google-login route 
    // to verify the JWT token and return the sessionToken & user object.
    fetch(`${API_BASE}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: jwtToken }),
    })
    .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return showStatus(data.error || "Google authentication failed.");

        sessionStorage.setItem("sessionToken", data.sessionToken);
        sessionStorage.setItem("cachedUser", JSON.stringify(data.user));
        window.location.href = "dashboard.html";
    })
    .catch(() => {
        showStatus("Google login network error.");
    });
};

/*==============================
        FORGOT PASSWORD
==============================*/
forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginStatus.textContent = "";
    
    const email = emailInput.value.trim();
    if (email === "" || !isValidEmail(email)) {
        return showStatus("Enter your registered email above first, then click 'Forgot Password?'.");
    }

    if (!confirm("Send a new password to " + email + "?")) return;

    fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
    .then(async (res) => {
        const data = await res.json();
        showStatus(data.message || "A new password has been sent to your email.", false);
    })
    .catch(() => {
        showStatus("Network error while resetting password.");
    });
});

/*==============================
        ACTIVE MENU
==============================*/
const nav = document.querySelectorAll(".top-menu a");
nav.forEach(item => {
    item.addEventListener("click", (e) => {
        if(item.getAttribute("href") === "#") {
            e.preventDefault(); 
        }
        nav.forEach(link => link.classList.remove("active"));
        item.classList.add("active");
    });
});

/*==============================
        PAGE LOADED
==============================*/
window.addEventListener("load", () => {
    console.log("IIEST Portal Loaded");
});

/*==============================
        INFO MODALS (ABOUT / CONTACT)
==============================*/
const aboutBtn = document.getElementById("aboutBtn");
const contactBtn = document.getElementById("contactBtn");
const aboutModal = document.getElementById("aboutModal");
const contactModal = document.getElementById("contactModal");
const closeBtns = document.querySelectorAll(".info-modal-close");

// Open Modals
aboutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    aboutModal.classList.add("active");
});

contactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    contactModal.classList.add("active");
});

// Close Modals (via X button)
closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        aboutModal.classList.remove("active");
        contactModal.classList.remove("active");
    });
});

// Close Modals (via clicking outside the card)
window.addEventListener("click", (e) => {
    if (e.target === aboutModal) aboutModal.classList.remove("active");
    if (e.target === contactModal) contactModal.classList.remove("active");
});

/*==============================
        CAPS LOCK DETECTION
==============================*/
const capsLockWarning = document.getElementById("capsLockWarning");

passwordInput.addEventListener("keyup", (e) => {
    if (e.getModifierState("CapsLock")) {
        capsLockWarning.classList.remove("d-none");
    } else {
        capsLockWarning.classList.add("d-none");
    }
});
passwordInput.addEventListener("blur", () => {
    capsLockWarning.classList.add("d-none");
});

/*==============================
        GOOGLE AUTH & FALLBACK
==============================*/
const googleBtn = document.getElementById("customGoogleBtn");
const googleFallbackMsg = document.getElementById("googleFallbackMsg");
const GOOGLE_CLIENT_ID = "434219339029-91ji5n9gc3ki0jak207damkkh6d5jqqu.apps.googleusercontent.com";

let tokenClient;

// Dynamically inject the script to catch adblocker failures
function loadGoogleScript() {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
        // Initialize the custom OAuth2 Token Client
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "email profile",
            callback: handleGoogleAuthResponse,
        });
    };

    script.onerror = () => {
        // Adblocker or network blocked the script
        googleBtn.disabled = true;
        googleBtn.style.opacity = "0.5";
        googleBtn.style.cursor = "not-allowed";
        
        googleFallbackMsg.textContent = "Google Login is blocked by your browser extensions. Please use email.";
        googleFallbackMsg.className = "login-status error text-center mt-2";
        googleFallbackMsg.classList.remove("d-none");
    };

    document.head.appendChild(script);
}

loadGoogleScript();

googleBtn.addEventListener("click", () => {
    if (tokenClient) {
        // Triggers the Google Popup
        tokenClient.requestAccessToken();
    }
});

function handleGoogleAuthResponse(response) {
    if (response.error) {
        return showStatus("Google authentication was cancelled or failed.");
    }

    googleBtn.classList.add("loading");
    showStatus("Authenticating with Google...", false);

    // Send the access token to the backend
    fetch(`${API_BASE}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: response.access_token }),
    })
    .then(async (res) => {
        googleBtn.classList.remove("loading");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Server returned a non-JSON response.");
        }

        const data = await res.json();
        if (!res.ok) return showStatus(data.error || "Google authentication failed.");

        sessionStorage.setItem("sessionToken", data.sessionToken);
        sessionStorage.setItem("cachedUser", JSON.stringify(data.user));
        window.location.href = "dashboard.html";
    })
    .catch((err) => {
        googleBtn.classList.remove("loading");
        if (err instanceof TypeError) {
            showStatus("Server error. Is the backend running properly?");
        } else {
            showStatus("Network error during Google login.");
        }
    });
}