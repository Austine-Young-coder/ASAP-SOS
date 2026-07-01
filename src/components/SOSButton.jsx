import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const HOLD_MS = 1400;

export default function SOSButton({ onTrigger, armed = false, label = "HOLD FOR SOS" }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startRef.current;
    const pct = Math.min(1, elapsed / HOLD_MS);
    setProgress(pct);
    if (pct >= 1) {
      setHolding(false);
      setProgress(0);
      onTrigger?.();
      if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [onTrigger]);

  const start = () => {
    setHolding(true);
    startRef.current = Date.now();
    if (navigator.vibrate) navigator.vibrate(20);
    rafRef.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    setHolding(false);
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const circumference = 2 * Math.PI * 108;

  return (
    <div style={{ position: "relative", width: 256, height: 256, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Ambient radar pulse rings */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.7], opacity: [0.35, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "1.5px solid #D7263D"
          }}
        />
      ))}

      {/* Hold progress ring */}
      <svg width={232} height={232} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={116} cy={116} r={108} fill="none" stroke="#1E2533" strokeWidth={4} />
        <circle
          cx={116}
          cy={116}
          r={108}
          fill="none"
          stroke="#F2A93B"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: holding ? "none" : "stroke-dashoffset 0.2s ease" }}
        />
      </svg>

      <motion.button
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        animate={{ scale: holding ? 0.94 : 1 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Hold to send emergency alert"
        style={{
          width: 196,
          height: 196,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #ED3A52, #D7263D 60%, #A11A2C 100%)",
          boxShadow: holding
            ? "0 0 0 0 rgba(215,38,61,0.0)"
            : "0 8px 32px rgba(215,38,61,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          color: "white",
          border: "none",
          touchAction: "none"
        }}
      >
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: "0.02em" }}>
          SOS
        </span>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", opacity: 0.85 }}>
          {holding ? "KEEP HOLDING…" : label}
        </span>
      </motion.button>
    </div>
  );
}
