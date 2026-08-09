/*==================================================
        THEME TOGGLE (DARK / LIGHT MODE & LOGO SWAP)
==================================================*/
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const rootHtml = document.documentElement;
const instituteLogo = document.getElementById("instituteLogo");

// Set default theme state explicitly (Light Mode)
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
        AI CHAT FLOATING WINDOW
==================================================*/
const aiToggleBtn = document.getElementById("aiToggleBtn");
const aiChatWindow = document.getElementById("aiChatWindow");
const aiCloseBtn = document.getElementById("aiCloseBtn");

aiToggleBtn.addEventListener("click", () => {
    aiChatWindow.classList.toggle("d-none");
});

aiCloseBtn.addEventListener("click", () => {
    aiChatWindow.classList.add("d-none");
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
        
        // Remove active class
        navItems.forEach(link => link.classList.remove("active"));
        item.classList.add("active");

        const targetId = item.getAttribute("data-target");

        // Topbar Title / Banner Logic
        if (targetId === "view-home") {
            homeBanner.classList.remove("d-none");
            pageTitle.classList.add("d-none");
        } else {
            homeBanner.classList.add("d-none");
            pageTitle.classList.remove("d-none");
            const linkText = item.querySelector("span").textContent;
            pageTitle.innerText = linkText;
        }

        // View Switching
        views.forEach(view => {
            if(view.id === targetId) {
                view.classList.remove("d-none");
            } else {
                view.classList.add("d-none");
            }
        });
    });
});

/*==================================================
        DYNAMIC REGISTRATION FORM TABLES
==================================================*/
function addRow(tableID) {
    const table = document.getElementById(tableID).getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length;
    const row = table.insertRow(rowCount);
    
    row.insertCell(0).innerHTML = rowCount + 1;
    row.insertCell(1).innerHTML = '<input type="text" placeholder="Code">';
    row.insertCell(2).innerHTML = '<input type="text" placeholder="Subject Name">';

    if(tableID === 'theoryTable') {
        row.insertCell(3).innerHTML = `
            <select>
                <option value="core">Core</option>
                <option value="elective">Elective</option>
            </select>`;
        row.insertCell(4).innerHTML = '<input type="number" step="0.5" placeholder="0.0">';
        row.insertCell(5).innerHTML = '<input type="text" placeholder="-">';
    }
}

window.addEventListener('load', () => {
    for(let i=0; i<5; i++) { addRow('theoryTable'); }
});