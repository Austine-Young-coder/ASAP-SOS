import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faBullhorn, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const SLIDES = [
  {
    icon: faLocationCrosshairs,
    accent: "#D7263D",
    eyebrow: "Step 01 — Locate",
    title: "Reach the responder closest to you",
    body: "ASAP-SOS uses your location to find the right police, fire, medical or disaster line for your state — no searching, no guessing during a crisis."
  },
  {
    icon: faBullhorn,
    accent: "#F2A93B",
    eyebrow: "Step 02 — Alert",
    title: "Call for backup from people nearby",
    body: "Send a broadcast — text or a short video — to other ASAP-SOS users close to you, or wider if you need more eyes and hands on the ground, fast."
  },
  {
    icon: faShieldHalved,
    accent: "#1AAE6F",
    eyebrow: "Step 03 — Stay ready",
    title: "Built for Nigeria, built for offline",
    body: "Set up your own panic trigger, keep key numbers saved on your device, and reach emergency contacts even with patchy network."
  }
];

export default function Onboarding({ onDone }) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0B0E14",
        display: "flex",
        flexDirection: "column",
        zIndex: 999
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: `${slide.accent}1A`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 28
              }}
            >
              <FontAwesomeIcon icon={slide.icon} style={{ fontSize: 30, color: slide.accent }} />
            </div>
            <div className="eyebrow" style={{ color: slide.accent, marginBottom: 10 }}>
              {slide.eyebrow}
            </div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 28,
                lineHeight: 1.25,
                margin: "0 0 14px",
                color: "#E8EDF2"
              }}
            >
              {slide.title}
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#93A0B4", margin: 0 }}>{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {SLIDES.map((s, i) => (
            <div
              key={s.eyebrow}
              style={{
                height: 4,
                flex: 1,
                borderRadius: 2,
                background: i <= index ? slide.accent : "#2A3242",
                transition: "background 0.3s ease"
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {!isLast && (
            <button className="btn btn-ghost" onClick={onDone} style={{ flex: "0 0 auto" }}>
              Skip
            </button>
          )}
          <button
            className="btn btn-primary btn-block"
            onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
