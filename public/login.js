document.addEventListener("DOMContentLoaded", function () {
  // Wait for the DOM to fully load, then attach the login form handler

  // Handle Login using JWT (JSON Web Token)
  document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get user's email and password from the form inputs
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        // Send a POST request to backend to log user in
        const response = await fetch("/auth/login", {
          method: "POST", // Use POST method to send login data
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify({ email, password }), // Convert login details to JSON format
        });

        const data = await response.json(); // Parse the response from the server

        if (response.ok) {
          // If login is successful, store the JWT token and user info in localStorage
          localStorage.setItem("jwt", data.token); // Store the token for future requests
          localStorage.setItem("user", JSON.stringify(data.user)); // Store the user data

          // Redirect the user to the main dashboard or another page
          window.location.href = "/index.html";
        } else {
          // If login fails, show an error message
          document.getElementById("error-message").innerText =
            data.message || "Login failed"; // Display the error from server or a default message
        }
      } catch (error) {
        // Handle any errors during the fetch or login process
        document.getElementById("error-message").innerText =
          "An error occurred during login."; // Display a generic error message
      }
    });
});
