from pytube import YouTube
import os

# Directory to save downloaded files
DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

def get_streams(video_url):
    """
    Retrieve available video resolutions and audio streams.

    Args:
        video_url (str): The YouTube video URL.

    Returns:
        dict: Available streams with video resolutions and audio.
    """
    yt = YouTube(video_url)
    video_streams = [
        {"itag": stream.itag, "resolution": stream.resolution, "fps": stream.fps}
        for stream in yt.streams.filter(progressive=False, type="video").order_by("resolution")
    ]
    audio_streams = [
        {"itag": stream.itag, "abr": stream.abr} for stream in yt.streams.filter(type="audio")
    ]
    return {
        "title": yt.title,
        "thumbnail_url": yt.thumbnail_url,
        "video_streams": video_streams,
        "audio_streams": audio_streams,
    }

def download_by_itag(video_url, itag):
    """
    Download a stream by its Itag.

    Args:
        video_url (str): The YouTube video URL.
        itag (int): The Itag of the desired stream.

    Returns:
        str: File path of the downloaded stream.
    """
    yt = YouTube(video_url)
    stream = yt.streams.get_by_itag(itag)
    file_path = stream.download(output_path=DOWNLOAD_FOLDER)
    return file_path
