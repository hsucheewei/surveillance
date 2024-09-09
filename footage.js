const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

const footageContainer = document.getElementById("footage-container");
const videoPlayerContainer = document.getElementById("videoPlayerContainer");
const videoPlayer = document.getElementById("videoPlayer");

// Function to format the date and time
function getDateAndTime(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const years = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  let ampm = "AM";

  if (hours >= 12) {
    hours = hours === 12 ? 12 : hours - 12;
    ampm = "PM";
  } else {
    hours = hours === 0 ? 12 : hours;
  }

  return {
    date: `${day} ${month} ${years}`,
    time: `${hours}:${minutes} ${ampm}`,
  };
}

// Create a table row for each footage
function createFootageRow(id, dateObj, deviceName, description, videoUrl) {
  const tr = document.createElement("tr");
  tr.id = id;
  // Add the hover effect class
  tr.className = "bg-white hover:bg-gray-100 cursor-pointer";

  const { date, time } = getDateAndTime(dateObj);

  const td1 = document.createElement("td");
  td1.className = "px-6 py-4 whitespace-nowrap";
  td1.textContent = date;
  tr.appendChild(td1);

  const td2 = document.createElement("td");
  td2.className = "px-6 py-4 whitespace-nowrap";
  td2.textContent = time;
  tr.appendChild(td2);

  const td3 = document.createElement("td");
  td3.className = "px-6 py-4 whitespace-nowrap";
  td3.textContent = description;
  tr.appendChild(td3);

  const td4 = document.createElement("td");
  td4.className = "px-6 py-4 whitespace-nowrap";
  td4.textContent = deviceName;
  tr.appendChild(td4);

  const td5 = document.createElement("td");
  td5.className = "px-6 py-4 whitespace-nowrap text-right";
  const button = document.createElement("button");
  button.className = "text-red-600 hover:text-red-900";
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-trash-alt";

  // Add click event listener to the delete button
  button.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the row click event
    deleteFootage(id, tr);
  });

  button.appendChild(icon);
  td5.appendChild(button);
  tr.appendChild(td5);

  // Add click event listener to the row for video playback
  tr.addEventListener("click", () => {
    if (videoUrl) {
      openVideoPlayer(videoUrl);
    } else {
      alert("No video available for this footage.");
    }
  });

  return tr;
}

// Show the video player in the right column
function openVideoPlayer(videoUrl) {
  videoPlayer.src = videoUrl;
  videoPlayerContainer.classList.remove("hidden"); // Make the video player visible
  videoPlayer.play();
}

// Fetch footages from the backend
async function fetchFootages() {
  const response = await fetch("/footages", { headers });
  const data = await response.json();
  return data;
}

// Delete the footage
async function deleteFootage(id, element) {
  let confirmDelete = confirm("Are you sure you want to delete this footage?");
  if (confirmDelete) {
    const res = await fetch(`/footages/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    element.remove();
  }
}

// Load and display footages
async function main() {
  const data = await fetchFootages();

  const sortedFootages = data.detections.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  for (let footage of sortedFootages) {
    const dateObj = new Date(footage.createdAt);
    const row = createFootageRow(
      footage.id,
      dateObj,
      footage.device.name,
      footage.description,
      footage.videoUrl // Pass the video URL to the row
    );
    footageContainer.appendChild(row);
  }
}

main();
