import React, { useEffect, useRef, useState } from "react";
import FaceEmote from "./FaceEmote/FaceEmote";

const Visualizer = ({
  audioData,
  isListening,
  intensity = 0,
  width = 600,
  height = 400,
  expression = "neutral",
  isSpeaking = false,
  viseme = 0,
}) => {
  const [mouthOpen, setMouthOpen] = useState(0);

  /* ===============================
     AUDIO → MOUTH OPEN (REAL)
     =============================== */
  useEffect(() => {
    if (!audioData || audioData.length === 0) {
      setMouthOpen(0);
      return;
    }

    // hitung average amplitude
    const avg =
      audioData.reduce((a, b) => a + b, 0) / audioData.length;

    // normalisasi 0..1
    const normalized = Math.min(avg / 180, 1);

    setMouthOpen(normalized);
  }, [audioData]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* FACE */}
      <FaceEmote
        expression={expression}
        isSpeaking={isSpeaking}
        viseme={viseme}
        size={Math.min(width, height) * 0.45}
      />
    </div>
  );
};

export default Visualizer;