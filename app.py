from flask import Flask, request, jsonify, send_file
from pytube import YouTube  # YouTube class needs to be imported
from downloader import Downloader
import os

# Initialize Flask app
app = Flask(__name__)

# Folder to save downloaded videos
DOWNLOAD_FOLDER = 'downloads'

# Ensure that the download folder exists
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

@app.route('/api/fetchStreams', methods=['GET'])
def fetch_streams():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        # Using PyTube to get available streams for the video
        yt = YouTube(url)
        streams = yt.streams.filter(progressive=True, file_extension='mp4').all()
        
        stream_data = [{
            'itag': stream.itag,
            'resolution': stream.resolution,
            'fps': stream.fps if stream.fps else 'N/A',
            'mime_type': stream.mime_type
        } for stream in streams]
        
        return jsonify({'streams': stream_data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/download', methods=['GET'])
def download_stream():
    itag = request.args.get('itag')
    url = request.args.get('url')
    if not itag or not url:
        return jsonify({'error': 'itag and url are required'}), 400
    
    try:
        # Create a Downloader instance
        downloader = Downloader(url, itag)
        downloader.start_download_thread()  # Start download in a separate thread
        
        # Wait for the download to finish
        downloader.wait_for_download()

        # File path for the downloaded video
        downloaded_file = os.path.join(DOWNLOAD_FOLDER, f"{itag}.mp4")
        
        # Check if the downloaded file exists
        if os.path.exists(downloaded_file):
            return send_file(downloaded_file, as_attachment=True)
        else:
            return jsonify({'error': 'Download failed, file not found.'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
