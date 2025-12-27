import React from "react";

/**
 * Props:
 * - isSpeaking: boolean (true = AI sedang bicara)
 * - viseme: number (0–5), optional
 * - expression: "neutral" | "smile" | "think" | "surprised"
 * - size: number (default 220)
 */
export default function FaceEmote({
  isSpeaking = false,
  viseme = 0,
  expression = "neutral",
  size = 220,
}) {
  /**
   * VISME → mouth openness
   * 0 = closed
   * 5 = fully open
   */
  const mouthOpen = Math.max(
    0,
    Math.min(1, viseme > 0 ? viseme / 5 : isSpeaking ? 0.6 : 0)
  );

  const mouthHeight = 6 + mouthOpen * 36;
  const mouthY = 140 - mouthHeight / 2;

  /* Eye expressions */
  const eyeY =
    expression === "think" ? 94 :
    expression === "surprised" ? 86 :
    90;

  const eyeScale =
    expression === "surprised" ? 1.4 :
    expression === "smile" ? 0.9 :
    1;

  /* Mouth curve (smile / think) */
  const mouthCurve =
    expression === "smile" ? 8 :
    expression === "think" ? -6 :
    0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      style={{ userSelect: "none" }}
    >
      {/* Face */}
      <circle cx="110" cy="110" r="96" fill="#041f24" />

      {/* Eyes */}
      <ellipse
        cx="80"
        cy={eyeY}
        rx={6 * eyeScale}
        ry={8 * eyeScale}
        fill="#7dd3fc"
      />
      <ellipse
        cx="140"
        cy={eyeY}
        rx={6 * eyeScale}
        ry={8 * eyeScale}
        fill="#7dd3fc"
      />

      {/* Mouth */}
      <rect
        x={110 - 30}
        y={mouthY + mouthCurve}
        width={60}
        height={mouthHeight}
        rx={10}
        fill="#7dd3fc"
        style={{
          transition: "height 0.08s linear, y 0.08s linear",
        }}
      />

      {/* Inner mouth (depth when open) */}
      {mouthOpen > 0.2 && (
        <rect
          x={110 - 24}
          y={mouthY + mouthCurve + 6}
          width={48}
          height={mouthHeight - 12}
          rx={8}
          fill="#02242b"
          opacity={0.7}
        />
      )}
    </svg>
  );
}