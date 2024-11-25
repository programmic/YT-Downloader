document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark');
    updateSquaresPosition();
});

function updateSquaresPosition() {
    const squares = document.querySelectorAll('body::before, body::after');

    if (document.body.classList.contains('dark')) {
        // Move squares for dark theme
        document.body.style.setProperty('--square-1-top', '100px');
        document.body.style.setProperty('--square-1-left', '30px');
        document.body.style.setProperty('--square-2-bottom', '50px');
        document.body.style.setProperty('--square-2-right', '80px');
    } else {
        // Reset positions for light theme
        document.body.style.setProperty('--square-1-top', '-50px');
        document.body.style.setProperty('--square-1-left', '-50px');
        document.body.style.setProperty('--square-2-bottom', '-100px');
        document.body.style.setProperty('--square-2-right', '-100px');
    }
}

async function handleDrop(event) {
    event.preventDefault();
    const url = event.dataTransfer.getData("text/plain");
    if (url) {
        await fetchStreams(url);
    }
}

async function fetchStreams(url) {
    try {
        const response = await fetch("/streams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });

        const result = await response.json();
        if (result.status === "success") {
            document.getElementById("preview-title").innerText = result.title;
            document.getElementById("preview-thumbnail").src = result.thumbnail_url;

            const videoSelect = document.getElementById("stream-select");
            videoSelect.innerHTML = "";
            result.video_streams.forEach(stream => {
                const option = document.createElement("option");
                option.value = stream.itag;
                option.innerText = `${stream.resolution} @ ${stream.fps} FPS`;
                videoSelect.appendChild(option);
            });

            // Enable the Download button after fetching streams
            document.getElementById('download-button').disabled = false;
        }
    } catch (error) {
        console.error("Error fetching streams:", error);
    }
}

document.getElementById('download-button').addEventListener('click', async function () {
    const selectedItag = document.getElementById('stream-select').value;
    if (selectedItag) {
        const url = `https://example.com/download?itag=${selectedItag}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4'; // Default file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

document.getElementById('dropzone').addEventListener('drop', handleDrop);
document.getElementById('dropzone').addEventListener('dragover', function (event) {
    event.preventDefault();
});
