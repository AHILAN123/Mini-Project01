/*==================================================
        IIEST SHIBPUR
Semester Registration Portal; SCRIPT.JS
==================================================*/


/*==============================
        DOM ELEMENTS
==============================*/

const form = document.querySelector("form");

const emailInput = document.querySelector(".email-group input");

const passwordInput = document.querySelector(".password-group input");

const eyeButton = document.getElementById("togglePassword");

const loginButton = document.querySelector(".login-btn");


/*==============================
        SHOW PASSWORD
==============================*/

eyeButton.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        eyeButton.classList.remove("fa-eye");
        eyeButton.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        eyeButton.classList.remove("fa-eye-slash");
        eyeButton.classList.add("fa-eye");

    }

});


/*==============================
        EMAIL VALIDATION
==============================*/

function isValidEmail(email){

    const regex =
    /^[a-zA-Z0-9._%+-]+@students\.iiests\.ac\.in$/;

    return regex.test(email);

}


/*==============================
        LOGIN
==============================*/

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const email=emailInput.value.trim();

    const password=passwordInput.value.trim();


    if(email===""){

        alert("Please enter your email.");

        emailInput.focus();

        return;

    }


    if(!isValidEmail(email)){

        alert("Please enter a valid email.");

        emailInput.focus();

        return;

    }


    if(password===""){

        alert("Please enter your password.");

        passwordInput.focus();

        return;

    }


    loginButton.disabled=true;

    loginButton.innerHTML="Signing In...";


    setTimeout(()=>{

        loginButton.innerHTML="Login";

        loginButton.disabled=false;

        alert("Frontend Login Successful");

    },1500);

});


/*==============================
        INPUT EFFECT
==============================*/

const groups=document.querySelectorAll(

".email-group,.password-group"

);

groups.forEach(group=>{

    const input=group.querySelector("input");

    input.addEventListener("focus",()=>{

        group.style.transform="translateY(-2px)";

    });

    input.addEventListener("blur",()=>{

        group.style.transform="translateY(0)";

    });

});


/*==============================
        ENTER KEY
==============================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        loginButton.click();

    }

});


/*==============================
        ACTIVE MENU
==============================*/

const nav=document.querySelectorAll(".top-menu a");

nav.forEach(item=>{

    item.addEventListener("click",(e)=>{

        e.preventDefault();

        nav.forEach(link=>{

            link.classList.remove("active");

        });

        item.classList.add("active");

    });

});


/*==============================
        PAGE LOADED
==============================*/

window.addEventListener("load",()=>{

    console.log("IIEST Portal Loaded");

});