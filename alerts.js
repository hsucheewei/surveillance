document.addEventListener("DOMContentLoaded", function () {
  const alertBody = document.getElementById("alertBody");

  // Function to format date and time in desired format
  function formatDateTime(timestamp) {
    const date = new Date(timestamp);

    // Options for date formatting
    const dateOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    // Options for time formatting
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      second: undefined,
      hour12: true, // Use 12-hour format (AM/PM)
    };

    // Format the date and time
    const formattedDate = date.toLocaleDateString("en-GB", dateOptions); // e.g., "29 August 2024"
    const formattedTime = date.toLocaleTimeString("en-GB", timeOptions); // e.g., "11:25 PM"

    return `${formattedDate} ${formattedTime}`; // Combine the date and time
  }

  // Function to populate the table with dynamic alert data
  function populateAlerts(data) {
    // sort the alerts by timestamp in descending order (most recent first)
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    data.forEach((alert) => {
      const tr = document.createElement("tr");
      tr.classList.add("hover:bg-gray-100");

      const dateTd = document.createElement("td");
      dateTd.classList.add("px-6", "py-4", "whitespace-nowrap");
      dateTd.textContent = formatDateTime(alert.timestamp); // Use formatDateTime function

      const detailsTd = document.createElement("td");
      detailsTd.classList.add("px-6", "py-4", "whitespace-nowrap");
      detailsTd.textContent = `Alert: ${
        alert.type
      } detected! Time triggered: ${formatDateTime(alert.timestamp)}`;

      tr.appendChild(dateTd);
      tr.appendChild(detailsTd);
      alertBody.appendChild(tr);
    });
  }

  // Retrieve detections from localStorage
  const storedDetections = JSON.parse(localStorage.getItem("detections")) || [];

  // Populate table with the stored detections
  populateAlerts(storedDetections);
});

document
  .getElementById("clearAlertsButton")
  .addEventListener("click", function () {
    localStorage.removeItem("detections"); // Clear detections from localStorage
    document.getElementById("alertBody").innerHTML = ""; // Clear the alert table
  });
