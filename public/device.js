const deviceGrid = document.getElementById("camera-grid");
const addBtn = document.getElementById("add-btn");
addBtn.addEventListener('click', addDevice);

// Set headers for all API requests
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Authorization token is included in all requests
};

// Main function to initialise page and load devices
main();

async function main() {
    const data = await fetchDevices(user.id); // Fetch devices for the current user
    for (let camera of data.devices) {
        // Create a device card for each camera and append it to the grid
        const deviceCard = createDeviceEl(camera.id, camera.name, camera.imageUrl);
        deviceGrid.appendChild(deviceCard);
    }
}

// Function to fetch devices from backend
async function fetchDevices(userId) {
    const res = await fetch(`/api/devices?userId=${userId}`, { headers });
    if (!res.ok) {
        throw new Error('Network response was not ok'); // Handle any network errors
    }
    const body = await res.json(); // Parse response body as JSON
    return body; // Return response body
}

// Function to create HTML for each device card
function createDeviceEl(id, name) {
    const deviceCard = document.createElement("a"); // Create anchor element for the card
    deviceCard.className = "bg-gray-700 text-white p-6 rounded-3xl flex flex-col justify-between gap-y-10";
    deviceCard.id = id; // Set id of the device
    deviceCard.href = `/detection?deviceId=${id}`; // Link card to a detection page for the specific device

    // Create header for device card with an icon and device name
    const headerDiv = document.createElement("div");
    headerDiv.className = "flex items-center mb-4";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-video mr-2"; // Add video icon

    const title = document.createElement("span");
    title.className = "text-2xl font-medium name"; // Add class for styling and display the device name
    title.textContent = name;

    headerDiv.appendChild(icon); // Append icon and name to the header
    headerDiv.appendChild(title);

    // Create div for buttons (delete and rename)
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "flex justify-end space-x-4"; // Styling for spacing between buttons

    // Delete button with an event listener to delete the device
    const deleteButton = document.createElement("button");
    deleteButton.className = "text-red-500 hover:text-red-700"; // Style delete button
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent default and stop propagation to avoid opening the link
        deleteDevice(id, deviceCard); // Call deleteDevice when clicked
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-alt"; // Add trash icon for delete
    deleteButton.appendChild(deleteIcon);

    // Edit button with an event listener to rename the device
    const editButton = document.createElement("button");
    editButton.className = "text-white hover:text-gray-300"; // Style rename button
    editButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent default and stop propagation
        renameDevice(id, deviceCard); // Call renameDevice when clicked
    });

    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen"; // Add pen icon for rename
    editButton.appendChild(editIcon);

    buttonDiv.appendChild(deleteButton); // Add delete and edit buttons to the button div
    buttonDiv.appendChild(editButton);

    // Append the header and button divs to the device card
    deviceCard.appendChild(headerDiv);
    deviceCard.appendChild(buttonDiv);

    return deviceCard; // Return the device card element
}

// Function to create a new device by sending a POST request to the backend
async function createDevice(userId, name) {
    try {
        const res = await fetch(`/api/devices`, {
            method: 'POST', // POST method to create new device
            headers,
            body: JSON.stringify({ userId, name }) // Send userId and name in the request body
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const body = await res.json(); // Parse the response
        const device = body.device; // Extract the created device from the response
        const deviceCard = createDeviceEl(device.id, device.name, device.imageUrl); // Create the device card
        deviceGrid.appendChild(deviceCard); // Add the new card to the grid
    } catch (error) {
        console.error('Failed to create device:', error); // Log errors
    }
}

// Function to rename a device
async function renameDevice(id, element) {
    let newName = prompt("Enter new name for the camera:"); // Prompt user for new device name
    if (newName) {
        // Make an API request to update the device name
        const res = await fetch(`/api/devices/${id}`, {
            method: 'PUT', // Use PUT method to update device
            headers,
            body: JSON.stringify({ name: newName }) // Send the new name in the request body
        });

        // Update the name in the device card if the request is successful
        element.querySelector('.name').textContent = newName;
    }
}

// Function to delete a device
async function deleteDevice(id, element) {
    let confirmDelete = confirm("Are you sure you want to delete this camera?"); // Confirm delete action
    if (confirmDelete) {
        const res = await fetch(`/api/devices/${id}`, {
            method: 'DELETE', // Use DELETE method to remove device
            headers,
        });

        if (!res.ok) {
            throw new Error('Network response was not ok'); // Handle any errors
        }

        element.remove(); // Remove the device card from the grid
    }
}

// Function to handle adding a new device
function addDevice() {
    const name = prompt("Enter the name of the camera:"); // Prompt for camera name
    createDevice(user.id, name); // Call createDevice to create the device
}
