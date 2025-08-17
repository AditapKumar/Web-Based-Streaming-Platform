const userVideo = document.getElementById("user-video");
const startCameraButton = document.getElementById("start-camera-btn");
const startStreamButton = document.getElementById("start-stream-btn");
const stopStreamButton = document.getElementById("stop-stream-btn");

const state = {
    media: null,
    mediaRecorder: null,
    isStreaming: false,
};

const socket = io();

socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
});

startCameraButton.addEventListener("click", async () => {
    try {
        const media = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        state.media = media;
        userVideo.srcObject = media;
        await userVideo.play();

        startCameraButton.disabled = true;
        startStreamButton.disabled = false;
    } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Could not access your camera and microphone. Please check your browser permissions.");
    }
});

startStreamButton.addEventListener("click", () => {
    if (!state.media) {
        alert("Please start the camera first.");
        return;
    }
    if (state.isStreaming) {
        alert("Already streaming.");
        return;
    }

    state.isStreaming = true;
    startStreamButton.disabled = true;
    stopStreamButton.disabled = false;

    console.log("Starting stream...");
    state.mediaRecorder = new MediaRecorder(state.media, {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        framerate: 25,
    });

    state.mediaRecorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
            console.log("Sending binary stream...", ev.data);
            socket.emit("binarystream", ev.data);
        }
    };
    
    state.mediaRecorder.onstop = () => {
        console.log("Recording stopped.");
        state.isStreaming = false;
        startStreamButton.disabled = false;
        stopStreamButton.disabled = true;
    };

    state.mediaRecorder.start(1000);
});

stopStreamButton.addEventListener("click", () => {
    if (!state.isStreaming) {
        alert("Not currently streaming.");
        return;
    }

    console.log("Stopping stream...");
    state.mediaRecorder.stop();

    if (state.media) {
        state.media.getTracks().forEach(track => track.stop());
        userVideo.srcObject = null;
        startCameraButton.disabled = false;
    }
});