const userVideo = document.getElementById("user-video");
const startButton = document.getElementById("start-btn");

// Define state object
const state = {
  media: null,
  isRecording: false,
  mediaRecorder: null,
};

// Connect to socket.io server
const socket = io();

// Socket connection event
socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

startButton.addEventListener("click", () => {
  if (!state.media) {
    alert("Please wait for camera to load first");
    return;
  }

  if (state.isRecording) {
    // Stop recording
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      state.mediaRecorder.stop();
    }
    state.isRecording = false;
    startButton.textContent = "Start";
    console.log("Recording stopped");
  } else {
    // Start recording
    state.mediaRecorder = new MediaRecorder(state.media, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      framerate: 25,
    });

    state.mediaRecorder.ondataavailable = (ev) => {
      console.log("Binary Stream Available", ev.data);
      socket.emit("binaryStream", ev.data);
    };

    state.mediaRecorder.start(1000);
    state.isRecording = true;
    startButton.textContent = "Stop";
    console.log("Recording started");
  }
});

window.addEventListener("load", async (e) => {
  try {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    state.media = media;
    userVideo.srcObject = media;
    await userVideo.play();
    console.log("Camera started successfully");
  } catch (error) {
    console.error("Error accessing media devices:", error);
    alert("Unable to access camera/microphone. Please check permissions.");
  }
});
