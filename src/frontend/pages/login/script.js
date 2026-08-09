document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 1. Password Visibility Toggle
    // =========================================
    const togglePassword = document.querySelector("#togglePassword");
    const passwordInput = document.querySelector("#password");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    }

    // =========================================
    // 2. Light / Dark Mode Toggle
    // =========================================
    const themeToggleBtn = document.getElementById("themeToggle");
    const themeIcon = themeToggleBtn.querySelector("i");
    
    // Check local storage to see if the user previously chose light mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.setAttribute("data-theme", "light");
        themeIcon.classList.replace("fa-sun", "fa-moon"); // Show moon when in light mode
    }

    // Toggle action
    themeToggleBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevents the page from jumping to the top
        
        // If currently light mode, switch to dark
        if (document.body.getAttribute("data-theme") === "light") {
            document.body.removeAttribute("data-theme");
            themeIcon.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        } 
        // If currently dark mode, switch to light
        else {
            document.body.setAttribute("data-theme", "light");
            themeIcon.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        }
    });
});