const loginBtn = document.querySelectorAll(".login-btn");
const signupBtn = document.querySelectorAll(".signup-btn");
const loginFormContainer = document.querySelector(".login-form-container")
const signupFormContainer = document.querySelector(".signup-form-container");
const closeLoginForm = document.querySelector("#close-login-form")
const closeSignupForm = document.querySelector("#close-signup-form")
const overlay = document.querySelector(".modal-overlay")
const loginForm = document.querySelector(".login-form-container form")
const signupForm = document.querySelector(".signup-form-container form");
const loginEmailInput = document.querySelector("#login-email");
const loginPasswordInput = document.querySelector("#login-password");
const signupNameInput = document.querySelector("#signup-name");
const signupSurnameInput = document.querySelector("#signup-surname");
const signupPhoneNumberInput = document.querySelector("#signup-phone-number");
const signupAddressInput = document.querySelector("#signup-address");
const signupEmailInput = document.querySelector("#signup-email");
const signupPasswordInput = document.querySelector("#signup-password");
const signupConfirmPasswordInput = document.querySelector("#signup-confirm-password");
const loginErrorMsg = document.querySelector("#login-error-msg");
const signupErrorMsg = document.querySelector("#signup-error-msg");
const cartIconSection = document.querySelector(".cart-icon-section")

function showLoginForm() {
    overlay.classList.remove("hidden");
    loginFormContainer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    loginErrorMsg.innerText = "";
    loginEmailInput.value = "";
    loginPasswordInput.value = "";
}

// loginBtn.addEventListener("click", showLoginForm)

loginBtn.forEach(el => el.addEventListener("click", () => {
    // alert("HI")
    hamburgerMenu.classList.remove("open");
    document.querySelector("header").classList.remove("menuOpen");
    document.querySelectorAll(".container").forEach(el => el.classList.remove("menuOpen"));
    showLoginForm();
}));

signupBtn.forEach(el => el.addEventListener("click", () => {
    hamburgerMenu.classList.remove("open");
    document.querySelector("header").classList.remove("menuOpen");
        document.querySelectorAll(".container").forEach(el => el.classList.remove("menuOpen"));
    overlay.classList.remove("hidden");
    signupFormContainer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}));

closeLoginForm.addEventListener("click", () => {
    overlay.classList.add("hidden");
    loginFormContainer.classList.add("hidden");
    document.body.style.overflow = "visible";
})

closeSignupForm.addEventListener("click", () => {
    overlay.classList.add("hidden");
    signupFormContainer.classList.add("hidden");
    document.body.style.overflow = "visible";
})

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    try {
        const response = await axios.post("/login", {
            email: loginEmailInput.value,
            password: loginPasswordInput.value
        })

        if (response.data.status === "error") {
            loginErrorMsg.innerText = response.data.error_message;
            loginErrorMsg.classList.add("messageFadeIn")
            loginErrorMsg.classList.remove("hidden")
            setTimeout(() => {
                loginErrorMsg.classList.remove("messageFadeIn");
                loginErrorMsg.classList.add("messageFadeOut")
                loginErrorMsg.addEventListener("animationend", (event) => {
                    if (event.animationName === "fadeOut") {
                        loginErrorMsg.classList.add("hidden");
                        loginErrorMsg.classList.remove("messageFadeOut")
                    }
                })
            }, 4500)
        } else if (response.data.status = "success") {
            const token = response.data.token;
            const user = [response.data.username, response.data.email]
            localStorage.setItem("jwtToken", token)
            localStorage.setItem("user", JSON.stringify(user))
            window.location.href = "user";
        }

    } catch (error) {
        console.log(error)
    }
})

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    try {
        const response = await axios.post("/signup", {
            name: signupNameInput.value,
            surname: signupSurnameInput.value,
            phoneNumber: signupPhoneNumberInput.value,
            address: signupAddressInput.value,
            email: signupEmailInput.value,
            password: signupPasswordInput.value,
            confirmPassword: signupConfirmPasswordInput.value
        })

        if (response.data.status === "error") {
            signupErrorMsg.innerText = response.data.error_message;
            signupErrorMsg.classList.add("messageFadeIn")
            signupErrorMsg.classList.remove("hidden")
            setTimeout(() => {
                signupErrorMsg.classList.remove("messageFadeIn");
                signupErrorMsg.classList.add("messageFadeOut")
                signupErrorMsg.addEventListener("animationend", (event) => {
                    if (event.animationName === "fadeOut") {
                        signupErrorMsg.classList.add("hidden");
                        signupErrorMsg.classList.remove("messageFadeOut")
                    }
                })
            }, 4500)
        } else if (response.data.status = "success") {
            window.location.href = "/signup/success";
        }

    } catch (error) {
        console.log(error)
    }
})

cartIconSection.addEventListener("click", () => {
    if (localStorage.getItem("jwtToken")) {
        window.location.href = "/cart";
    } else {
        showLoginForm();
    }
})