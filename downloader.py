# downloader.py
import os
from pytube import YouTube
import threading

class Downloader:
    def __init__(self, url, itag):
        self.url = url
        self.itag = itag
        self.is_downloaded = False

    def start_download_thread(self):
        # Start the download in a separate thread
        download_thread = threading.Thread(target=self.download)
        download_thread.start()

    def download(self):
        try:
            yt = YouTube(self.url)
            stream = yt.streams.get_by_itag(self.itag)
            
            # Define the download path
            download_path = os.path.join('downloads', f"{self.itag}.mp4")
            stream.download(output_path='downloads', filename=f"{self.itag}.mp4")
            
            self.is_downloaded = True
        except Exception as e:
            print(f"Error during download: {str(e)}")

    def wait_for_download(self):
        # Wait for the download to complete
        while not self.is_downloaded:
            pass