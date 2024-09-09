// Get the logout button element
const logoutBtn = document.getElementById("logout-btn");

// Add event listener to the logout button only if it exists
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// Logout function
function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "/login";
}

// Check if user is authenticated on protected pages
function checkAuth() {
  const token = localStorage.getItem("jwt");

  if (!token || token === "undefined" || token === null) {
    window.location.href = "/login";
  }
}

// Call checkAuth on page load for protected pages
checkAuth();

// Retrieve token and user from localStorage
const token = localStorage.getItem("jwt");
const user = JSON.parse(localStorage.getItem("user"));
