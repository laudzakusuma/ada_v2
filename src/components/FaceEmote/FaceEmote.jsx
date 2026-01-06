import React, { useEffect, useState } from "react";
import "./FaceEmote.css";

export default function FaceEmote({
    speechLevel = 0,
    isSpeaking = false
}) {
    const [mouthOpen, setMouthOpen] = useState(0);

    useEffect(() => {
        if (!isSpeaking) {
            // 🔒 FORCE CLOSE when silent
            setMouthOpen(0);
            return;
        }

        // 🎤 Smooth lipsync
        const target = Math.min(Math.max(speechLevel, 0), 1);

        setMouthOpen(prev => {
            const smooth = prev + (target - prev) * 0.35;
            return smooth;
        });

    }, [speechLevel, isSpeaking]);

    return (
        <div className="face">
            <div className="eyes">
                <span />
                <span />
            </div>

            <div
                className="mouth"
                style={{
                    height: `${12 + mouthOpen * 38}px`,
                    borderRadius: `${mouthOpen > 0.15 ? 999 : 6}px`,
                    transition: "height 0.08s linear, border-radius 0.12s ease"
                }}
            />
        </div>
    );
}