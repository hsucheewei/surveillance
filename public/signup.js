// Get the sign-up form element by its ID
const signupForm = document.getElementById("signup-form");

// Handle Sign Up using JWT
// Add submit event listener to the form
signupForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior (page refresh)

  // Get email and password values from the form inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Send POST request to the /auth/signup endpoint to register the user
    const response = await fetch("/auth/signup", {
      method: "POST", // Use POST method to send data
      headers: {
        "Content-Type": "application/json", // Set request content type to JSON
      },
      body: JSON.stringify({ email, password }), // Convert email and password into a JSON object
    });

    const data = await response.json(); // Parse response from the server as JSON

    if (response.ok) {
      // If signup is successful, redirect user to main dashboard
      window.location.href = "/login.html";
    } else {
      // If signup fails, displayn error message
      alert(data.message || "Sign up failed");
    }
  } catch (error) {
    // Handle any network or request errors and display a message
    alert("An error occurred during sign up.");
  }
});
