import { useEffect } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { socket } from "../../socket";

export default function GestureCanvas() {
  useEffect(() => {
    // hidden video source
    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.style.display = "none";
    document.body.appendChild(video);

    // mediapipe hands
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });

    let lastX = null;
    let lastEmit = 0;

    hands.onResults((res) => {
      // throttle (~20fps)
      const now = Date.now();
      if (now - lastEmit < 50) return;
      lastEmit = now;

      if (!res.multiHandLandmarks?.length) return;

      const lm = res.multiHandLandmarks[0];

      // ===== PINCH → SCALE =====
      const dx = lm[4].x - lm[8].x;
      const dy = lm[4].y - lm[8].y;
      const pinch = Math.sqrt(dx * dx + dy * dy);

      if (pinch < 0.03) {
        socket.emit("gesture:event", { type: "scale", value: 0.98 });
      } else if (pinch > 0.06) {
        socket.emit("gesture:event", { type: "scale", value: 1.02 });
      }

      // ===== HORIZONTAL MOVE → ROTATE Y =====
      const x = lm[8].x;
      if (lastX !== null) {
        const delta = x - lastX;
        if (Math.abs(delta) > 0.005) {
          socket.emit("gesture:event", {
            type: "rotateY",
            value: delta * 2,
          });
        }
      }
      lastX = x;
    });

    // webcam
    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    // cleanup
    return () => {
      camera.stop();
      hands.close();
      document.body.removeChild(video);
    };
  }, []);

  return null;
}