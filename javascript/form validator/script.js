const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const labels = document.querySelectorAll(".password-label");
const passwordMessage = document.querySelector(".password-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = password.value;
  const passConfirm = confirmPassword.value;

  if (!username.value) {
    alert("Username is required");
    return;
  }

  if (!email.value) {
    alert("Email is required");
    return;
  }

  if (!password.value) {
    alert("Password is required");
    return;
  }

  if (!confirmPassword.value) {
    alert("Confirm Password is required");
    return;
  }

  if (pass !== passConfirm) {
    console.log("Passwords do not match");
    labels.forEach((label) => {
      label.classList.add("label-error");
    });
    passwordMessage.style.display = "block";
    password.value = "";
    confirmPassword.value = "";
  } else {
    labels.forEach((label) => {
      label.classList.remove("label-error");
    });
    passwordMessage.style.display = "none";
  }
});
