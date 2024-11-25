from flask import Flask, render_template, request, jsonify, send_from_directory
from pytube import YouTube
from pytube.exceptions import VideoUnavailable
import os
import threading
import tempfile
import shutil

app = Flask(__name__)

# Directory to store downloaded videos
DOWNLOAD_FOLDER = "downloads"
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

def download_video(url, itag, temp_dir):
    try:
        yt = YouTube(url)
        stream = yt.streams.get_by_itag(itag)
        if stream:
            stream.download(output_path=temp_dir)
            return os.path.join(temp_dir, stream.default_filename)
        else:
            return None
    except VideoUnavailable:
        return None

def download_audio(url, itag, temp_dir):
    try:
        yt = YouTube(url)
        stream = yt.streams.get_by_itag(itag)
        if stream:
            stream.download(output_path=temp_dir)
            return os.path.join(temp_dir, stream.default_filename)
        else:
            return None
    except VideoUnavailable:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/streams', methods=['POST'])
def fetch_streams():
    data = request.get_json()
    url = data.get("url")
    try:
        yt = YouTube(url)
        title = yt.title
        thumbnail_url = yt.thumbnail_url

        video_streams = [
            {"itag": stream.itag, "resolution": stream.resolution, "fps": stream.fps}
            for stream in yt.streams.filter(progressive=True, file_extension="mp4")
        ]
        audio_streams = [
            {"itag": stream.itag, "abr": stream.abr}
            for stream in yt.streams.filter(only_audio=True)
        ]
        return jsonify({
            "status": "success",
            "title": title,
            "thumbnail_url": thumbnail_url,
            "video_streams": video_streams,
            "audio_streams": audio_streams
        })
    except VideoUnavailable:
        return jsonify({"status": "error", "message": "Video is unavailable."})

@app.route('/download', methods=['POST'])
def download():
    data = request.get_json()
    url = data.get("url")
    itag = data.get("itag")

    # Temporary directory for downloads
    temp_dir = tempfile.mkdtemp()

    # Choose whether to download audio or video
    stream_thread = None
    if itag:
        stream_thread = threading.Thread(target=download_video, args=(url, itag, temp_dir))
        stream_thread.start()

    return jsonify({"status": "success", "message": "Download started."})

@app.route('/file/<filename>')
def send_file(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
