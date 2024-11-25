document.getElementById('fetch-streams').addEventListener('click', async () => {
    const url = document.getElementById('url-input').value.trim();
    if (!url) {
        alert("Please enter a valid YouTube URL.");
        return;
    }

    document.getElementById('loading-overlay').classList.add('active');
    try {
        const response = await fetch(`https://example.com/api/fetchStreams?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error("Network error");

        const data = await response.json();
        populateStreamOptions(data);
        document.getElementById('stream-select-container').style.display = 'block';
    } catch (error) {
        console.error("Error fetching streams:", error);
        alert("Failed to fetch streams. Please try again.");
    } finally {
        document.getElementById('loading-overlay').classList.remove('active');
    }
});

const populateStreamOptions = (data) => {
    const streamSelect = document.getElementById('stream-select');
    streamSelect.innerHTML = '<option value="" disabled selected>Select a stream</option>';
    data.streams.forEach(stream => {
        const option = document.createElement('option');
        option.value = stream.itag;
        option.textContent = `${stream.resolution} - ${stream.fps} fps`;
        streamSelect.appendChild(option);
    });
    document.getElementById('download-button').disabled = false;
};

document.getElementById('download-button').addEventListener('click', () => {
    const selectedItag = document.getElementById('stream-select').value;
    if (selectedItag) {
        const a = document.createElement('a');
        a.href = `https://example.com/download?itag=${selectedItag}`;
        a.download = 'video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("Please select a stream to download.");
    }
});
