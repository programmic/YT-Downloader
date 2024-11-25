// Fetch streams from Flask backend
async function fetchStreams() {
    try {
        document.getElementById('loading-overlay').classList.add('active');
        const url = document.getElementById('url-input').value;
        if (!url.match(/youtube\.com|youtu\.be/)) {
            alert('Please enter a valid YouTube link');
            document.getElementById('loading-overlay').classList.remove('active');
            return;
        }

        // Call Flask backend to get streams
        const response = await fetch(`/api/fetchStreams?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            document.getElementById('loading-overlay').classList.remove('active');
            return;
        }

        populateStreamOptions(data);
        document.getElementById('loading-overlay').classList.remove('active');
    } catch (error) {
        console.error("Error fetching streams:", error);
        document.getElementById('loading-overlay').classList.remove('active');
    }
}

// Populate stream options in the dropdown
function populateStreamOptions(data) {
    const streamSelect = document.getElementById('stream-select');
    streamSelect.innerHTML = '';
    data.streams.forEach(stream => {
        const option = document.createElement('option');
        option.value = stream.itag;
        option.textContent = `${stream.resolution} - ${stream.fps}`;
        streamSelect.appendChild(option);
    });
    streamSelect.style.display = 'block';
    document.getElementById('download-button').disabled = false;
}

// Download stream when the user selects an option
document.getElementById('download-button').addEventListener('click', function () {
    const selectedItag = document.getElementById('stream-select').value;
    const url = document.getElementById('url-input').value;

    if (selectedItag) {
        const downloadUrl = `/api/download?itag=${encodeURIComponent(selectedItag)}&url=${encodeURIComponent(url)}`;
        
        // Redirect to download URL (will start the file download)
        window.location.href = downloadUrl;
    }
});
