document.getElementById('video-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent the default form submission

    const videoInput = document.getElementById('video');
    const uploadStatus = document.getElementById('upload-status');

    // Check if a file was selected
    if (videoInput.files.length === 0) {
        uploadStatus.innerText = 'Select video to upload.';
        return;
    }

    const formData = new FormData();
    formData.append('video', videoInput.files[0]);  // Add the selected video to the form data

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            uploadStatus.innerText = `Upload successful: ${result.file.filename}`;
        } else {
            const errorResult = await response.json();
            uploadStatus.innerText = `Upload failed: ${errorResult.message}`;
        }
    } catch (error) {
        uploadStatus.innerText = `An error occurred: ${error.message}`;
    }
});
