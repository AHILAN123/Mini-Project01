/*==================================================
        AUTH GUARD + LOAD LOGGED-IN USER'S PROFILE
==================================================*/
const API_BASE = "http://localhost:5000/api/auth";

const sessionToken = sessionStorage.getItem("sessionToken");

if (!sessionToken) {
    window.location.href = "index.html";
}

// SMART NAME EXTRACTION FIX (Handles Roll Numbers & Emails)
function getInitials(name) {
    if (!name) return "ST";
    const parts = name.trim().split(/[\s_.]+/).filter(p => !/^\d/.test(p));
    if (parts.length === 0) return name.substring(0, 2).toUpperCase();
    const initials = parts.slice(0, 2).map(p => p[0]).join("");
    return initials.toUpperCase();
}

function applyUserToDashboard(user, feeStatus = false) {
    let displayName = user.fullname;
    
    if (!displayName || displayName === "Pending Admin Input" || displayName === "Institute Student") {
        const emailPrefix = user.email.split("@")[0]; 
        const namePart = emailPrefix.split(".").pop(); 
        displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1); 
    }

    const initials = getInitials(displayName);

    // 1. Sidebar Elements
    const sidebarAvatarEl = document.querySelector(".sidebar .avatar");
    const sidebarNameEl = document.getElementById("sidebarName");
    const sidebarEmailEl = document.getElementById("sidebarEmail");

    if (sidebarAvatarEl && !sidebarAvatarEl.style.backgroundImage.includes("url")) sidebarAvatarEl.textContent = initials;
    if (sidebarNameEl) sidebarNameEl.textContent = displayName;
    if (sidebarEmailEl) sidebarEmailEl.textContent = user.email;

    // 2. Dashboard Greeting Elements
    const dashboardGreeting = document.getElementById("dashboardGreeting");
    if (dashboardGreeting) dashboardGreeting.textContent = `Welcome back, ${displayName}!`;

    // 3. Update the Dynamic Fee Status Card
    const feeCard = document.querySelector('.status-card p'); // Targets the first card
    if (feeCard) {
        if (feeStatus) {
            feeCard.textContent = "Cleared";
            feeCard.className = "text-success";
        } else {
            feeCard.textContent = "Pending";
            feeCard.className = "text-warning";
        }
    }

    // 4. Settings Elements
    const settingsAvatarEl = document.getElementById("settingsAvatar");
    const settingsNameEl = document.getElementById("settingsName");
    const settingsEmailEl = document.getElementById("settingsEmail");
    const settingsFormName = document.getElementById("settingsFormName");
    const settingsFormEmail = document.getElementById("settingsFormEmail");

    if (settingsAvatarEl && !settingsAvatarEl.style.backgroundImage.includes("url")) settingsAvatarEl.textContent = initials;
    if (settingsNameEl) settingsNameEl.textContent = displayName;
    if (settingsEmailEl) settingsEmailEl.textContent = user.email;
    if (settingsFormName) settingsFormName.value = displayName;
    if (settingsFormEmail) settingsFormEmail.value = user.email;

    // 5. Registration Form Elements
    const regName = document.getElementById("regName");
    const regEmail = document.getElementById("regEmail");
    const regMobile = document.getElementById("regMobile");
    const regEnrollmentNo = document.getElementById("regEnrollmentNo"); // <-- Add this
    
    if (regName) regName.value = displayName;
    if (regEmail) regEmail.value = user.email;
    if (regMobile) regMobile.value = user.mobile || "Pending Admin Input";
    if (regEnrollmentNo) regEnrollmentNo.value = user.enrollmentNo || "Pending Admin Input"; // <-- Add this

    // 6. Contact Input
    const mobileInputEl = document.getElementById("mobileInput");
    if (mobileInputEl) mobileInputEl.value = user.mobile || "";
}

// Paint instantly from cache, then fetch fresh
const cachedUserRaw = sessionStorage.getItem("cachedUser");
if (cachedUserRaw) {
    try {
        applyUserToDashboard(JSON.parse(cachedUserRaw));
    } catch (err) {}
}

if (sessionToken) {
    fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
    })
    .then(async (res) => {
        if (res.status === 401) {
            sessionStorage.removeItem("sessionToken");
            sessionStorage.removeItem("cachedUser");
            window.location.href = "index.html";
            return;
        }
        const data = await res.json();
        if (!res.ok) return;

        // Store and apply with the real fee status!
        sessionStorage.setItem("cachedUser", JSON.stringify(data.user));
        applyUserToDashboard(data.user, data.feeStatus);
    })
    .catch((err) => console.error("Network error loading profile:", err));
}

const logoutBtn = document.querySelector(".logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("sessionToken");
        sessionStorage.removeItem("cachedUser");
    });
}

/*==================================================
        THEME TOGGLE (DARK / LIGHT MODE & LOGO SWAP)
==================================================*/
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const rootHtml = document.documentElement;
const instituteLogo = document.getElementById("instituteLogo");

rootHtml.setAttribute("data-theme", "light");
if (instituteLogo) instituteLogo.src = "logo.png"; // Fixed path

themeToggleBtn.addEventListener("click", () => {
    let currentTheme = rootHtml.getAttribute("data-theme");
    
    if(currentTheme === "light") {
        rootHtml.setAttribute("data-theme", "dark");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        if (instituteLogo) instituteLogo.src = "logo_white.png"; // Fixed path
    } else {
        rootHtml.setAttribute("data-theme", "light");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        if (instituteLogo) instituteLogo.src = "logo.png"; // Fixed path
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
        "Update Contact Info": "संपर्क जानकारी अद्यतन करें"
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
        "Update Contact Info": "যোগাযোগের তথ্য আপডেট করুন"
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
        DYNAMIC REGISTRATION FORM TABLES (AUTOFILL)
==================================================*/
const semesterSelect = document.getElementById("semesterSelect");
const dynamicFormSections = document.getElementById("dynamicFormSections");

if (semesterSelect) {
    semesterSelect.addEventListener("change", (e) => {
        // Unhide the rest of the form!
        if (dynamicFormSections) dynamicFormSections.classList.remove("d-none");
        loadCoursesForSemester(e.target.value);
    });
}

async function loadCoursesForSemester(semester) {
    try {
        const res = await fetch(`http://localhost:5000/api/admin/courses/${semester}`, {
            headers: { Authorization: `Bearer ${sessionToken}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch courses");
        
        const courses = await res.json();

        // Separate into Theory and Practical
        const theoryCourses = courses.filter(c => c.category === 'Theory');
        const practicalCourses = courses.filter(c => c.category === 'Practical');

        renderTable('theoryTable', theoryCourses);
        renderTable('practicalTable', practicalCourses);

    } catch (err) {
        console.error("Failed to load dynamic curriculum:", err);
        // Fallback: 5 empty rows if server fails or no courses found
        renderEmptyRows('theoryTable', 5);
        renderEmptyRows('practicalTable', 5);
    }
}

function renderTable(tableID, courses) {
    const tbody = document.querySelector(`#${tableID} tbody`);
    if (!tbody) return;
    tbody.innerHTML = "";

    if (courses.length === 0) {
        renderEmptyRows(tableID, 5);
        return;
    }

    courses.forEach((course, index) => {
        const row = tbody.insertRow();
        const isCore = course.subjectType === 'Core';
        const readOnlyAttr = isCore ? 'readonly class="readonly-input"' : '';
        const disabledAttr = isCore ? 'disabled class="readonly-input"' : '';

        row.insertCell(0).innerHTML = index + 1;
        row.insertCell(1).innerHTML = `<input type="text" value="${course.courseCode || ''}" ${readOnlyAttr} required>`;
        row.insertCell(2).innerHTML = `<input type="text" value="${course.courseName}" ${readOnlyAttr} required>`;
        row.insertCell(3).innerHTML = isCore ? 
            `<select ${disabledAttr} required><option value="Core" selected>Core</option></select>` :
            `<select required><option value="Core">Core</option><option value="Elective" selected>Elective</option></select>`;
        row.insertCell(4).innerHTML = `<input type="number" step="0.5" value="${course.credits}" ${readOnlyAttr} required>`;
        row.insertCell(5).innerHTML = `<input type="text" placeholder="-">`;
        
        row.insertCell(6).innerHTML = isCore ? 
            `<span style="color: var(--text-muted); text-align: center; display:block;"><i class="fa-solid fa-lock"></i></span>` :
            `<button type="button" class="remove-row-btn" onclick="removeRow(this)"><i class="fa-solid fa-xmark"></i></button>`;
    });
}

function renderEmptyRows(tableID, count) {
    const tbody = document.querySelector(`#${tableID} tbody`);
    if (!tbody) return;
    tbody.innerHTML = "";
    for(let i=0; i<count; i++) addRow(tableID);
}

function addRow(tableID) {
    const tbody = document.querySelector(`#${tableID} tbody`);
    if (!tbody) return;
    const rowCount = tbody.rows.length;
    const row = tbody.insertRow(rowCount);
    
    row.insertCell(0).innerHTML = rowCount + 1;
    row.insertCell(1).innerHTML = `<input type="text" placeholder="Code" required>`;
    row.insertCell(2).innerHTML = `<input type="text" placeholder="Subject Name" required>`;
    row.insertCell(3).innerHTML = `<select required><option value="Core">Core</option><option value="Elective" selected>Elective</option></select>`;
    row.insertCell(4).innerHTML = `<input type="number" step="0.5" min="0" placeholder="0.0" required>`;
    row.insertCell(5).innerHTML = `<input type="text" placeholder="-">`;
    row.insertCell(6).innerHTML = `
        <button type="button" class="remove-row-btn" onclick="removeRow(this)" title="Remove Row">
            <i class="fa-solid fa-xmark"></i>
        </button>`;
        
    updateRowNumbers(tableID);
}

window.removeRow = function(button) {
    const row = button.closest('tr');
    const tableID = row.closest('table').id;
    row.remove();
    updateRowNumbers(tableID);
};

function updateRowNumbers(tableID) {
    const tbody = document.querySelector(`#${tableID} tbody`);
    if(!tbody) return;
    const rows = tbody.rows;
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }
}

window.addEventListener('load', () => {
    if (window.innerWidth <= 992) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
    
    setTimeout(() => {
        if(semesterSelect && semesterSelect.value) {
            loadCoursesForSemester(semesterSelect.value);
        } else {
            renderEmptyRows('theoryTable', 5);
            renderEmptyRows('practicalTable', 5);
        }
    }, 500);

    const paymentDateInput = document.getElementById('paymentDate');
    if(paymentDateInput) {
        const today = new Date().toISOString().split('T')[0];
        paymentDateInput.setAttribute('max', today);
    }
});

/*==================================================
        PASSWORD VERIFICATION LOGIC (SETTINGS)
==================================================*/
const passwordModalOverlay = document.getElementById("passwordModalOverlay");
const cancelVerifyBtn = document.getElementById("cancelVerifyBtn");
const passwordVerifyForm = document.getElementById("passwordVerifyForm");

let verifySuccessCallback = null;
let verifyCancelCallback = null;

function triggerVerificationFlow(onSuccess, onCancel = null) {
    verifySuccessCallback = onSuccess;
    verifyCancelCallback = onCancel;
    passwordVerifyForm.reset();
    
    const icon = passwordVerifyForm.querySelector('.toggle-password');
    if (icon) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        passwordVerifyForm.querySelector('input').type = 'password';
    }

    passwordModalOverlay.classList.remove("d-none");
    setTimeout(() => passwordVerifyForm.querySelector('input').focus(), 100);
}

function closeVerifyModal() {
    passwordModalOverlay.classList.add("d-none");
    if(verifyCancelCallback) verifyCancelCallback();
    verifySuccessCallback = null;
    verifyCancelCallback = null;
}

if (cancelVerifyBtn) cancelVerifyBtn.addEventListener("click", closeVerifyModal);

if (passwordVerifyForm) {
    passwordVerifyForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        passwordModalOverlay.classList.add("d-none");
        if (verifySuccessCallback) verifySuccessCallback(); 
        verifySuccessCallback = null;
        verifyCancelCallback = null;
    });
}

/*==================================================
        AVATAR & CONTACT INFO EDITING
==================================================*/
const editMobileBtn = document.getElementById("editMobileBtn");
const mobileInput = document.getElementById("mobileInput");
const saveMobileBtn = document.getElementById("saveMobileBtn");

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
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

/*==================================================
        REGISTRATION FORM SUBMISSION
==================================================*/
const regForm = document.getElementById('regForm');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = regForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        const subjects = [];
        
        // Loop through both Theory and Practical tables to gather all subjects
        ['theoryTable', 'practicalTable'].forEach(tableID => {
            const tbody = document.querySelector(`#${tableID} tbody`);
            if (tbody) {
                for (let row of tbody.rows) {
                    const code = row.cells[1].querySelector('input').value;
                    const name = row.cells[2].querySelector('input').value;
                    const type = row.cells[3].querySelector('select').value;
                    const credit = row.cells[4].querySelector('input').value;
                    if (code && name) {
                        subjects.push({ 
                            code, 
                            name, 
                            type, 
                            credit, 
                            category: tableID === 'theoryTable' ? 'Theory' : 'Practical' 
                        });
                    }
                }
            }
        });

        const payload = {
            semester: document.querySelector('select:not([disabled])').value, 
            paymentDate: document.getElementById('paymentDate').value,
            subjects: subjects
        };

        try {
            const res = await fetch(`http://localhost:5000/api/registration/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (res.ok) {
                alert("Success! Your semester registration has been submitted.");
                document.querySelector('.nav-item[data-target="view-pdf"]').click();
            } else {
                alert(data.error || "Submission failed.");
            }
        } catch (err) {
            alert("Network error occurred.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Application";
        }
    });
}

/* ==================================================
   GENERATE REGISTRATION PDF
================================================== */
const pdfNavItem = document.querySelector('.nav-item[data-target="view-pdf"]');
const pdfViewer = document.getElementById("pdfViewer");
const pdfLoading = document.getElementById("pdfLoading");
const pdfError = document.getElementById("pdfError");

if (pdfNavItem) {
    pdfNavItem.addEventListener("click", async () => {
        if (!sessionToken) {
            window.location.href = "index.html";
            return;
        }

        pdfLoading.classList.remove("d-none");
        pdfError.classList.add("d-none");
        pdfViewer.removeAttribute("src");

        try {
            const response = await fetch("http://localhost:5000/api/generatePdf", {
                method: "POST",
                headers: { Authorization: `Bearer ${sessionToken}` }
            });

            if (!response.ok) throw new Error("Failed to generate PDF.");
            
            const pdfBlob = await response.blob();
            pdfViewer.src = URL.createObjectURL(pdfBlob);

        } catch (error) {
            pdfError.textContent = error.message || "Could not generate PDF.";
            pdfError.classList.remove("d-none");
        } finally {
            pdfLoading.classList.add("d-none");
        }
    });
}