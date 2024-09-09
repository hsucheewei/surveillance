// Function to toggle the visibility of form and rotate an icon
function toggleForm(formId, iconId) {
  // Get the form and icon elements by their IDs
  const form = document.getElementById(formId);
  const icon = document.getElementById(iconId);

  // Check if form is currently hidden
  if (form.classList.contains("hidden")) {
    // If hidden, show form and rotate icon 180 degrees
    form.classList.remove("hidden");
    icon.classList.add("rotate-180");
  } else {
    // If already visible, hide form and reset icon rotation
    form.classList.add("hidden");
    icon.classList.remove("rotate-180");
  }
}

// Function to display the detection results and send them to the backend
function displayDetections(predictions) {
  // Clear previous detection results before showing new ones
  detectionResults.innerHTML = "";

  // Check if there are any predictions (detections)
  if (predictions.length > 0) {
    // Loop through each prediction and display the detection info
    predictions.forEach((prediction) => {
      // Create paragraph element for each detection
      const p = document.createElement("p");

      // Set paragraph text to show the detection class, confidence score, and bounding box coordinates
      p.textContent = `Detected ${
        prediction.class
      } with confidence ${prediction.score.toFixed(2)} at (${prediction.bbox.join(", ")})`;

      // Append paragraph to the detection results container
      detectionResults.appendChild(p);

      // Send detection data to backend (using fetch API)
      fetch("http://localhost:5000/detect", {
        method: "POST", // Use POST request to send data
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          class: prediction.class, // Send the detected class
          score: prediction.score, // Send the confidence score
          bbox: prediction.bbox, // Send the bounding box coordinates
        }),
      })
        .then((response) => response.json()) // Parse the JSON response from the server
        .then((data) => console.log("Server response:", data)) // Log the server's response
        .catch((err) => console.error("Error sending data to backend:", err)); // Log any errors
    });
  } else {
    // If there are no predictions, display "No detections."
    detectionResults.textContent = "No detections.";
  }
}
