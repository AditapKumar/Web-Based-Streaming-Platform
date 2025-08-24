# Web-Based Streaming Platform

This project is a web-based streaming platform that allows users to stream video and audio from their browser to an RTMP server, such as YouTube Live. It captures media from the user's camera and microphone, sends it to a Node.js server, which then uses FFmpeg to stream it to the desired RTMP endpoint.

---

## How it Works

The project is comprised of a frontend and a backend that work together to create the streaming functionality.

### Frontend

The frontend is a single HTML page with a JavaScript file that handles user interaction and media capture. When the user clicks the "Start Camera" button, the browser requests access to the user's camera and microphone. Once access is granted, the video is displayed on the page. When the "Start Stream" button is clicked, the browser begins recording the media and sending it to the backend in chunks via a WebSocket connection.

### Backend

The backend is a Node.js server that uses Express and Socket.IO. It serves the frontend files and listens for WebSocket connections. When a client connects, the server spawns an FFmpeg process with the specified options for encoding and streaming. The server then listens for binary data from the client, which it pipes directly into the FFmpeg process. This process then streams the media to the specified RTMP endpoint.

The backend is also dockerized, with a `Dockerfile` and `docker-compose.yml` file for easy setup and deployment.

---

## Getting Started

To get started with this project, you will need to have Docker and Docker Compose installed. You will also need to have a YouTube channel and a live stream set up to get your stream key.

### Installation

1.  Clone the repository:
    ```
    git clone [https://github.com/aditapkumar/web-based-streaming-platform.git](https://github.com/aditapkumar/web-based-streaming-platform.git)
    ```
2.  Navigate to the project directory:
    ```
    cd web-based-streaming-platform
    ```
3.  Open the `index.js` file and replace `"rtmp://a.rtmp.youtube.com/live2/your-stream-key"` with your RTMP server URL and stream key.
4.  Build and run the Docker container:
    ```
    docker-compose up -d --build
    ```

### Usage

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  Click the "Start Camera" button to start your camera.
3.  Click the "Start Stream" button to start streaming.
4.  Click the "Stop Stream" button to stop streaming.
