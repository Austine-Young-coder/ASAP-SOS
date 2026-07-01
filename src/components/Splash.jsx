import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState("pulse"); // pulse -> expand -> done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("expand"), 1400);
    const t2 = setTimeout(() => onDone?.(), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0B0E14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          overflow: "hidden"
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Expanding circle that will cover the whole page */}
        <motion.div
          initial={{ width: 96, height: 96, borderRadius: "50%" }}
          animate={
            phase === "expand"
              ? { width: "300vmax", height: "300vmax", borderRadius: "50%" }
              : { width: 96, height: 96, borderRadius: "50%" }
          }
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "absolute",
            background: "#D7263D"
          }}
        />

        {/* Logo content, fades as the circle expands past it */}
        <motion.div
          animate={{ opacity: phase === "expand" ? 0 : 1, scale: phase === "expand" ? 1.15 : 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#D7263D",
              boxShadow: "0 0 0 0 rgba(215,38,61,0.6)"
            }}
          />
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.04em",
              color: "#E8EDF2"
            }}
          >
            ASAP<span style={{ color: "#D7263D" }}>-SOS</span>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#5B6678"
            }}
          >
            Help is one tap away
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
