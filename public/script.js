const userVideo = document.getElementById("user-video");
const startButton = document.getElementById("start-btn");

// Define state object
const state = {
  media: null,
};

// Connect to socket.io server
const socket = io();

// Socket connection event
socket.on('connect', () => {
  console.log('Connected to server with socket ID:', socket.id);
});

startButton.addEventListener("click", () => {
  if (!state.media) {
    alert("Please wait for camera to load first");
    return;
  }

  const mediaRecorder = new MediaRecorder(state.media, {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    framerate: 25,
  });

  mediaRecorder.ondataavailable = (ev) => {
    console.log("Binary Stream Available", ev.data);
    socket.emit("binarystream", ev.data);
  };

  mediaRecorder.start(25);
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
