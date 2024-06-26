document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");

    // Check the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const formType = urlParams.get('form');

    if (formType === 'login') {
        container.classList.remove("active");
    } else {
        container.classList.add("active");
    }
});

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signUpForm = document.getElementById('sign-up-form');
const signInForm = document.getElementById('sign-in-form');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeButton = document.querySelector('.close-button');
const favoriteColor = document.getElementById('favorite-color');
const favoriteColorLabel = document.getElementById('favorite-color-label');
const forgotPasswordLink = document.getElementById('forgot-password');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
        "signup-confirm-password"
    ).value;
    const birthdate = document.getElementById("birthdate-input").value;
    const formattedDate = moment(birthdate).format('DD/MM/YYYY');
    
    if (
        username === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === "" ||
        formattedDate === ""
    ) {
        showModal("All fields are required");
    } else if (!validateEmail(email)) {
        showModal("Please enter a valid email");
    } else if (password !== confirmPassword) {
        showModal("Passwords do not match");
    } else {
        signup(username, email, password, formattedDate);
    }
});

function signup(username, email, password, formattedDate) {
    const formType = "Signup";
    $.ajax({
        url: "/login-signup",
        type: "POST",
        data: {
            username_inp: username,
            pass_inp: password,
            email_inp: email,
            birthdate_inp: formattedDate,
            form_type_inp: formType
        },
        success: function (response) {
            if (response.success) {
                window.location.href = '/'; 
            } else {
                showModal("Signup failed");
            }
        },
        error: function (xhr, status, error) {
            showModal("Signup Failed");
        },
    });
}

signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    if (email === "" || password === "") {
        showModal("All fields are required");
    } else if (!validateEmail(email)) {
        showModal("Please enter a valid email");
    } else {
        login(email, password);
    }
});

function login(email, password) {
    const formType = "Login";
    $.ajax({
        url: "/login-signup",
        type: "POST",
        data: {
            email_inp: email,
            pass_inp: password,
            form_type_inp: formType
        },
        success: function (response) {
            if (response.success) {
                if (response.user.userType === "Admin"){
                    window.location.href = '/dashboard';
                } else{
                    console.log(response.user.id);
                    window.location.href = '/'; 
                }
            } else {
                showModal("Wrong password");
            }
        },
        error: function (xhr, status, error) {
            console.log("Error details:", xhr.responseText);
            showModal("Login failed: " + xhr.responseText);
        },
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
}

closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

forgotPasswordLink.addEventListener("mouseenter", () => {
    forgotPasswordLink.style.color = "#f19f13";
});

forgotPasswordLink.addEventListener("mouseleave", () => {
    forgotPasswordLink.style.color = "#333"; // Reset color on mouse leave
});

forgotPasswordLink.addEventListener("mousedown", (event) => {
    event.preventDefault();
    showModalWithDropdown();
});

function showModalWithDropdown() {
    const forgotPasswordModal = document.getElementById(
        "forgot-password-modal"
    );
    forgotPasswordModal.style.display = "block";

    const closeButton = forgotPasswordModal.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
        forgotPasswordModal.style.display = "none";
    });

    const confirmColorButton = document.getElementById("confirm-color");
    confirmColorButton.addEventListener("click", () => {
        const chosenColor = document.getElementById("chosen-color").value;
        const favoriteColorLabel = document.getElementById(
            "favorite-color-label"
        );
        favoriteColorLabel.textContent = chosenColor;
        forgotPasswordModal.style.display = "none";
    });
}

// Add an event listener to the confirm button
document.getElementById("confirm-button").addEventListener("click", () => {
    closeModal();
});

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}

document.getElementById('sign-in-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email === '' || password === '') {
        showModal('All fields are required');
    } else if (!validateEmail(email)) {
        showModal('Please enter a valid email');
    } else {
        login(email, password);
    }
});



function signup(username, email, password, formattedDate) {
    
    const formType = "Signup";

    $.ajax({
        url: "/login-signup",
        type: "POST",
        data: {
            username_inp: username,
            pass_inp: password,
            email_inp: email,
            birthdate_inp: formattedDate,
            form_type_inp: formType
        },
        success: function (response) {
            if (response.success) {
                window.location.href = '/'; 
            } else {
                showModal("Signup failed");
            }
        },
        error: function (xhr, status, error) {
            showModal("Signup Failed");
        },
    });
}

signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    if (email === "" || password === "") {
        showModal("All fields are required");
    } else if (!validateEmail(email)) {
        showModal("Please enter a valid email");
    } else {
        login(email, password);
    }
});

function login(email, password) {
    const formType = "Login";
    $.ajax({
        url: "/login-signup",
        type: "POST",
        data: {
            email_inp: email,
            pass_inp: password,
            form_type_inp: formType
        },
        success: function (response) {
            if (response.success) {
                if (response.user.userType === "Admin"){
                    window.location.href = '/dashboard';
                } else{
                    console.log(response.user.id);
                    window.location.href = '/'; 
                }
            } else {
                showModal("Wrong password");
            }
        },
        error: function (xhr, status, error) {
            console.log("Error details:", xhr.responseText);
            showModal("Login failed: " + xhr.responseText);
        },
    });
}

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
}

closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

forgotPasswordLink.addEventListener("mouseenter", () => {
    forgotPasswordLink.style.color = "#f19f13";
});

forgotPasswordLink.addEventListener("mouseleave", () => {
    forgotPasswordLink.style.color = "#333"; // Reset color on mouse leave
});

forgotPasswordLink.addEventListener("mousedown", (event) => {
    event.preventDefault();
    showModalWithDropdown();
});

function showModalWithDropdown() {
    const forgotPasswordModal = document.getElementById(
        "forgot-password-modal"
    );
    forgotPasswordModal.style.display = "block";

    const closeButton = forgotPasswordModal.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
        forgotPasswordModal.style.display = "none";
    });

    const confirmColorButton = document.getElementById("confirm-color");
    confirmColorButton.addEventListener("click", () => {
        const chosenColor = document.getElementById("chosen-color").value;
        const favoriteColorLabel = document.getElementById(
            "favorite-color-label"
        );
        favoriteColorLabel.textContent = chosenColor;
        forgotPasswordModal.style.display = "none";
    });
}

// Add an event listener to the confirm button
document.getElementById("confirm-button").addEventListener("click", () => {
    closeModal();
});

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}

document.getElementById('sign-in-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    fetch('/login-signup/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    }).then(response => {
      if (response.ok) {
        window.location.href = '/admin'; // Redirect to the admin page if login is successful
      } else {
        response.text().then(text => {
          alert(text); // Display an error message if login fails
        });
      }
    }).catch(error => {
      console.error('Error:', error);
    });
  });