const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const demosSection = document.getElementById("demos");
const statusEl = document.getElementById("status");
const enableWebcamButton = document.getElementById("webcamButton");
let mediaRecorder = null;
let recordedChunks = [];
const headers = { Authorization: `Bearer ${token}` };
const params = new URLSearchParams(window.location.search);
const deviceId = params.get("deviceId");
let detectedType = "unknown";

// Setting a cooldown period for sending alerts (once every 30 seconds)
const alertCooldown = 30000;
let lastAlertTime = 0; // Time when the last alert was sent

// Function to check if the browser supports webcam access
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam is supported, attach an event listener to the button to enable the webcam
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener("click", enableCam); // Call enableCam function when clicked
} else {
  console.warn("getUserMedia() is not supported by your browser"); // Log a warning if not supported
  statusEl.textContent = "Webcam not supported by your browser"; // Update the status text
}

// Function to enable the webcam and start the live stream
async function enableCam(event) {
  if (!model) {
    console.error("Model not loaded yet"); // Make sure model is loaded before proceeding
    return;
  }

  event.target.classList.add("hidden"); // Hide button when webcam is activated

  // Setup constraints to include video and audio
  const constraints = { video: true, audio: true };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints); // Get webcam stream
    video.srcObject = stream; // Set the video source to webcam stream
    video.addEventListener("loadeddata", predictWebcam); // Start making predictions once video is ready

    mediaRecorder = new MediaRecorder(stream); // Create a media recorder for recording video

    // Handle video data as it's being recorded
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data); // Store recorded video chunks
      }
    };

    // When recording stops, process the recorded video
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" }); // Convert chunks into a single blob
      recordedChunks = []; // Clear recorded chunks
      submit(blob); // send video to backend
    };
  } catch (err) {
    console.error("Error accessing the webcam: ", err); // Log errors if webcam access fails
    statusEl.textContent =
      "Error accessing the webcam. Please check permissions."; // Update status message
  }
}

// Function to start recording the webcam stream
function startRecording() {
  recordedChunks = []; // Clear previous chunks before starting new recording
  startTime = Date.now(); // Record the start time
  mediaRecorder.start(); // Start recording
}

// Function to stop recording the webcam stream
function stopRecording() {
  endTime = Date.now(); // Record stop time
  mediaRecorder.stop(); // Stop recording
}

// Function to submit video blob to the server
async function submit(blob) {
  const formData = new FormData();
  formData.append("video", blob, "clip.webm"); // Append video blob to form data
  formData.append("deviceId", deviceId); // Append deviceId to form data
  formData.append("description", detectedType || "unknown"); // Append detected object type

  const res = await fetch("/footages", {
    method: "POST", // Send a POST request
    body: formData, // Include form data
    headers,
  });

  console.log(await res.json()); // Log response from server
}

let model = undefined; // Placeholder for object detection model

// Load object detection model and update status once ready
cocoSsd
  .load()
  .then(function (loadedModel) {
    console.log("Model loaded."); // Log model loading success
    statusEl.textContent = 'Click "Enable Webcam" to start surveillance'; // Update status text
    model = loadedModel; // Assign the loaded model
    demosSection.classList.remove("opacity-20"); // Make the demo section active
  })
  .catch(function (error) {
    console.error("Error loading the model: ", error); // Log errors if the model fails to load
    statusEl.textContent = "Error loading the model."; // Update status message
  });

let children = []; // Array to store elements added to the live view for bounding boxes
const relevantClasses = [
  "person",
  "dog",
  "cat",
  "car",
  "motorcycle",
  "bus",
  "truck",
  "bicycle",
]; // Array of object classes to detect
let startTime = null;
let endTime = null;

// Function to capitalise first letter of string
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to predict objects using the webcam feed
function predictWebcam() {
  model.detect(video).then(function (predictions) {
    // Clear previous frame's predictions
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]); // Remove previous bounding boxes and labels
    }
    children.splice(0); // Clear children array

    const validPred = []; // Array to store valid predictions

    // Loop through predictions and display bounding boxes for high-confidence detections
    for (let n = 0; n < predictions.length; n++) {
      if (
        predictions[n].score > 0.66 && // Only show predictions with confidence > 66%
        relevantClasses.includes(predictions[n].class) // Check if detected object is relevant
      ) {
        validPred.push(predictions[n]); // Add valid prediction to array
        detectedType = capitalizeFirstLetter(predictions[n].class); // Store detected type

        const bbox = predictions[n].bbox; // Get bounding box coordinates
        const bboxWidth = bbox[2]; // Width of the bounding box
        const bboxHeight = bbox[3]; // Height of the bounding box
        const bboxLeft = bbox[0]; // Left position of the bounding box
        const bboxTop = bbox[1]; // Top position of the bounding box

        // Create label element for the detected object
        const p = document.createElement("p");
        p.innerText =
          capitalizeFirstLetter(predictions[n].class) +
          ": " +
          Math.round(parseFloat(predictions[n].score) * 100) +
          "% confidence"; // Show class and confidence score
        p.style = `
          margin-left: ${bboxLeft}px; 
          margin-top: ${bboxTop - 30}px; 
          width: ${bboxWidth}px;
          top: 0; left: 0;
        `;
        p.classList.add(
          "absolute",
          "p-1",
          "bg-white",
          "text-black",
          "text-sm",
          "rounded-lg",
          "shadow-md",
          "border",
          "border-solid",
          "border-white",
          "text-xs",
          "z-20"
        );

        // Create a highlighter box around the detected object
        const highlighter = document.createElement("div");
        highlighter.style = `
          left: ${bboxLeft}px;
          top: ${bboxTop}px;
          width: ${bboxWidth}px;
          height: ${bboxHeight}px;
          background-color: rgba(255, 255, 255, 0.25);
          border: 2px solid #ffffff;
          border-radius: 10px;
          position: absolute;
          z-index: 10;
        `;

        highlighter.classList.add(
          "absolute",
          "bg-opacity-20",
          "border-2",
          "border-solid",
          "border-white",
          "rounded-lg",
          "shadow-lg",
          "z-10"
        );

        // Append highlighter and label to the live view
        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter); // Keep track of added elements
        children.push(p);

        // Check cooldown period before sending an alert
        const currentTime = Date.now();
        if (currentTime - lastAlertTime > alertCooldown) {
          sendAlert(detectedType); // Send alert with detected type
          lastAlertTime = currentTime; // Update last alert time
        }
      }
    }

    // Start recording when valid detections are found
    if (startTime === null && validPred.length > 0) {
      startRecording();
    }

    // Stop recording after 19 seconds
    if (startTime !== null && Date.now() - startTime > 19000) {
      stopRecording();
    }

    // Keep predicting by calling function recursively
    window.requestAnimationFrame(predictWebcam);
  });
}

// Function to send an alert when a relevant object is detected
function sendAlert(type) {
  console.log(`Sending alert for detected ${type}`); // Log alert for tracking

  // Create an alert object with detected type and timestamp
  const newAlert = {
    type: type,
    timestamp: new Date().toISOString(),
  };

  // Get existing detections from localStorage or initialise an empty array
  const storedDetections = JSON.parse(localStorage.getItem("detections")) || [];

  // Add new alert to the list of detections
  storedDetections.push(newAlert);

  // Save updated detections back to localStorage
  localStorage.setItem("detections", JSON.stringify(storedDetections));
}
