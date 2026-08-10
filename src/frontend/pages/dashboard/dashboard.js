/*==================================================
        THEME TOGGLE (DARK / LIGHT MODE & LOGO SWAP)
==================================================*/
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const rootHtml = document.documentElement;
const instituteLogo = document.getElementById("instituteLogo");

rootHtml.setAttribute("data-theme", "light");
if (instituteLogo) instituteLogo.src = "../../assets/images/logo.png";

themeToggleBtn.addEventListener("click", () => {
    let currentTheme = rootHtml.getAttribute("data-theme");
    
    if(currentTheme === "light") {
        rootHtml.setAttribute("data-theme", "dark");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        if (instituteLogo) instituteLogo.src = "../../assets/images/logo_white.png";
    } else {
        rootHtml.setAttribute("data-theme", "light");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        if (instituteLogo) instituteLogo.src = "../../assets/images/logo.png";
    }
});

/*==================================================
        SIDEBAR COLLAPSE TOGGLE
==================================================*/
const sidebarToggleBtn = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

/*==================================================
        DASHBOARD ACTIVE MENU HANDLING (SPA LOGIC)
==================================================*/
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view-section");
const pageTitle = document.getElementById("pageTitle");
const homeBanner = document.getElementById("homeBanner");

navItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault(); 
        
        navItems.forEach(link => link.classList.remove("active"));
        item.classList.add("active");

        const targetId = item.getAttribute("data-target");

        if (targetId === "view-home") {
            homeBanner.classList.remove("d-none");
            pageTitle.classList.add("d-none");
        } else {
            homeBanner.classList.add("d-none");
            pageTitle.classList.remove("d-none");
            const linkText = item.querySelector("span").textContent;
            pageTitle.innerText = linkText;
        }

        views.forEach(view => {
            if(view.id === targetId) {
                view.classList.remove("d-none");
            } else {
                view.classList.add("d-none");
            }
        });
        
        if (window.innerWidth <= 992) {
            sidebar.classList.add('collapsed');
        }
    });
});

/*==================================================
        SIDEBAR PROFILE CLICK -> PROFILE SETTINGS
==================================================*/
const sidebarUserProfile = document.getElementById("sidebarUserProfile");

if (sidebarUserProfile) {
    sidebarUserProfile.addEventListener("click", () => {
        const settingsNav = document.querySelector('.nav-item[data-target="view-settings"]');
        if (settingsNav) {
            settingsNav.click();
            const profileSection = document.getElementById("profileSettingsSection");
            if (profileSection) {
                profileSection.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
}

/*==================================================
        AUTO-TRANSLATE (GOOGLE WIDGET + FALLBACK)
==================================================*/
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,bn',
        autoDisplay: false
    }, 'google_translate_element');
}

const languageSelect = document.getElementById("languageSelect");

const translationDictionary = {
    hi: {
        "Home": "मुख्य पृष्ठ",
        "Registration Form": "पंजीकरण फॉर्म",
        "History": "इतिहास",
        "Settings": "सेटिंग्स",
        "Logout": "लॉग आउट",
        "About": "के बारे में",
        "Help": "सहायता",
        "Account Settings": "खाता सेटिंग्स",
        "Profile Details": "प्रोफ़ाइल विवरण",
        "Security & Password": "सुरक्षा और पासवर्ड",
        "Update Security": "पासवर्ड अद्यतन करें",
        "Update Contact Info": "संपर्क जानकारी अद्यतन करें",
        "Portal Preferences": "पोर्टल प्राथमिकताएं",
        "Notification Preferences": "अधिसूचना प्राथमिकताएं"
    },
    bn: {
        "Home": "হোম",
        "Registration Form": "নিবন্ধন ফর্ম",
        "History": "ইতিহাস",
        "Settings": "সেটিংস",
        "Logout": "লগ আউট",
        "About": "সম্পর্কে",
        "Help": "সাহায্য",
        "Account Settings": "অ্যাকাউন্ট সেটিংস",
        "Profile Details": "প্রোফাইল বিবরণ",
        "Security & Password": "সুরক্ষা এবং পাসওয়ার্ড",
        "Update Security": "পাসওয়ার্ড আপডেট করুন",
        "Update Contact Info": "যোগাযোগের তথ্য আপডেট করুন",
        "Portal Preferences": "পোর্টাল পছন্দসমূহ",
        "Notification Preferences": "বিজ্ঞপ্তি পছন্দসমূহ"
    }
};

if (languageSelect) {
    languageSelect.addEventListener("change", (e) => {
        const lang = e.target.value;
        document.documentElement.lang = lang;

        const googleCombo = document.querySelector(".goog-te-combo");
        if (googleCombo) {
            googleCombo.value = lang;
            googleCombo.dispatchEvent(new Event("change"));
        } else {
            document.querySelectorAll("[data-translate]").forEach(el => {
                const key = el.getAttribute("data-translate");
                if (lang === "en") {
                    el.innerText = key;
                } else if (translationDictionary[lang] && translationDictionary[lang][key]) {
                    el.innerText = translationDictionary[lang][key];
                }
            });
        }
    });
}

/*==================================================
        DYNAMIC REGISTRATION FORM TABLES (ADD/REMOVE)
==================================================*/
function addRow(tableID) {
    const table = document.getElementById(tableID).getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length;
    const row = table.insertRow(rowCount);
    
    row.insertCell(0).innerHTML = rowCount + 1;
    row.insertCell(1).innerHTML = '<input type="text" placeholder="Code" required>';
    row.insertCell(2).innerHTML = '<input type="text" placeholder="Subject Name" required>';

    if(tableID === 'theoryTable') {
        row.insertCell(3).innerHTML = `
            <select required>
                <option value="core">Core</option>
                <option value="elective">Elective</option>
            </select>`;
        row.insertCell(4).innerHTML = '<input type="number" step="0.5" min="0" placeholder="0.0" required>';
        row.insertCell(5).innerHTML = '<input type="text" placeholder="-">';
        
        // Add Remove Button Cell
        row.insertCell(6).innerHTML = `
            <button type="button" class="remove-row-btn" onclick="removeRow(this)" title="Remove Row">
                <i class="fa-solid fa-xmark"></i>
            </button>`;
    }
    
    updateRowNumbers(tableID);
}

function removeRow(button) {
    // Traverse up to the TR element and remove it
    const row = button.closest('tr');
    const tableID = row.closest('table').id;
    row.remove();
    
    // Recalculate Serial Numbers so they stay sequential
    updateRowNumbers(tableID);
}

function updateRowNumbers(tableID) {
    const tbody = document.getElementById(tableID).getElementsByTagName('tbody')[0];
    const rows = tbody.rows;
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }
}

/*==================================================
        OTP VERIFICATION LOGIC (ROCK-SOLID ENGINE)
==================================================*/
const otpModalOverlay = document.getElementById("otpModalOverlay");
const cancelOtpBtn = document.getElementById("cancelOtpBtn");
const otpForm = document.getElementById("otpForm");

let otpSuccessCallback = null;
let otpCancelCallback = null;

function triggerVerificationFlow(onSuccess, onCancel = null) {
    otpSuccessCallback = onSuccess;
    otpCancelCallback = onCancel;
    otpForm.reset();
    otpModalOverlay.classList.remove("d-none");
}

function closeOtpModal() {
    otpModalOverlay.classList.add("d-none");
    if(otpCancelCallback) {
        otpCancelCallback();
    }
    otpSuccessCallback = null;
    otpCancelCallback = null;
}

if (cancelOtpBtn) {
    cancelOtpBtn.addEventListener("click", closeOtpModal);
}

if (otpForm) {
    otpForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        otpModalOverlay.classList.add("d-none");
        
        if (otpSuccessCallback) {
            otpSuccessCallback(); 
        }
        
        otpSuccessCallback = null;
        otpCancelCallback = null;
    });
}

window.addEventListener('load', () => {
    if (window.innerWidth <= 992) {
        sidebar.classList.add('collapsed');
    }
    for(let i=0; i<5; i++) { addRow('theoryTable'); }

    const paymentDateInput = document.getElementById('paymentDate');
    if(paymentDateInput) {
        const today = new Date().toISOString().split('T')[0];
        paymentDateInput.setAttribute('max', today);
    }
});

/*==================================================
        AVATAR (PICK FILE FIRST -> THEN VERIFY)
==================================================*/
const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const avatarInput = document.getElementById("avatarInput");
const settingsAvatar = document.getElementById("settingsAvatar");
const sidebarAvatar = document.querySelector(".sidebar .avatar");
const removeAvatarBtn = document.getElementById("removeAvatarBtn");

if (uploadPhotoBtn && avatarInput) {
    uploadPhotoBtn.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { 
                alert("File size must be less than 2MB.");
                avatarInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgUrl = event.target.result;
                
                triggerVerificationFlow(
                    () => {
                        settingsAvatar.style.backgroundImage = `url('${imgUrl}')`;
                        settingsAvatar.textContent = "";
                        if (sidebarAvatar) {
                            sidebarAvatar.style.backgroundImage = `url('${imgUrl}')`;
                            sidebarAvatar.style.backgroundSize = "cover";
                            sidebarAvatar.textContent = "";
                        }
                        alert("Profile picture updated securely.");
                    }, 
                    () => {
                        avatarInput.value = ""; 
                    }
                );
            };
            reader.readAsDataURL(file);
        }
    });
}

if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener("click", () => {
        triggerVerificationFlow(() => {
            settingsAvatar.style.backgroundImage = "none";
            settingsAvatar.textContent = "AB";
            if (sidebarAvatar) {
                sidebarAvatar.style.backgroundImage = "none";
                sidebarAvatar.textContent = "AB";
            }
            avatarInput.value = "";
            alert("Profile picture removed securely.");
        });
    });
}

/*==================================================
        MOBILE NUMBER (VERIFY BEFORE EDIT)
==================================================*/
const editMobileBtn = document.getElementById("editMobileBtn");
const mobileInput = document.getElementById("mobileInput");
const saveMobileBtn = document.getElementById("saveMobileBtn");
const contactForm = document.getElementById('contactForm');

if (editMobileBtn) {
    editMobileBtn.addEventListener("click", () => {
        triggerVerificationFlow(() => {
            mobileInput.removeAttribute("readonly");
            mobileInput.classList.remove("readonly-input");
            saveMobileBtn.removeAttribute("disabled");
            mobileInput.focus();
        });
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Mobile number updated successfully!");
        mobileInput.setAttribute("readonly", "true");
        mobileInput.classList.add("readonly-input");
        saveMobileBtn.setAttribute("disabled", "true");
    });
}

/*==================================================
        SECURITY FORM (VERIFY TO SAVE)
==================================================*/
const securityForm = document.getElementById('securityForm');
if(securityForm) {
    securityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPass = document.getElementById('newPass').value;
        const confirmPass = document.getElementById('confirmPass').value;
        
        if (newPass !== confirmPass) {
            alert("Your new passwords do not match. Please try again.");
            return;
        }
        
        triggerVerificationFlow(() => {
            alert("Password updated securely!");
            securityForm.reset();
            
            // Re-hide passwords after submit reset
            const icons = securityForm.querySelectorAll('.toggle-password');
            icons.forEach(icon => {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                icon.title = "Show Password";
            });
        });
    });
}

/*==================================================
        PASSWORD VISIBILITY TOGGLE
==================================================*/
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.previousElementSibling; 
        
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
            this.title = "Hide Password";
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
            this.title = "Show Password";
        }
    });
});

// Registration Form Submit
const regForm = document.getElementById('regForm');
if(regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Registration form submitted successfully!");
    });
}