import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCamera,
  faBell,
  faPhone,
  faComment,
  faPersonWalking,
  faWindowRestore,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

const PERMISSIONS = [
  {
    id: "location",
    icon: faLocationDot,
    title: "Location",
    body: "Finds the emergency line closest to you and shares your position when you send an alert.",
    request: () =>
      new Promise((resolve) => {
        if (!("geolocation" in navigator)) return resolve("unsupported");
        navigator.geolocation.getCurrentPosition(
          () => resolve("granted"),
          () => resolve("denied"),
          { timeout: 8000 }
        );
      })
  },
  {
    id: "notifications",
    icon: faBell,
    title: "Notifications",
    body: "Alerts you the moment someone nearby broadcasts an emergency.",
    request: async () => {
      if (!("Notification" in window)) return "unsupported";
      const res = await Notification.requestPermission();
      return res === "granted" ? "granted" : "denied";
    }
  },
  {
    id: "camera",
    icon: faCamera,
    title: "Camera & microphone",
    body: "Lets your panic button record a video the instant you trigger it.",
    request: () =>
      new Promise((resolve) => {
        if (!navigator.mediaDevices?.getUserMedia) return resolve("unsupported");
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            stream.getTracks().forEach((t) => t.stop());
            resolve("granted");
          })
          .catch(() => resolve("denied"));
      })
  },
  {
    id: "motion",
    icon: faPersonWalking,
    title: "Physical activity",
    body: "Detects sudden falls or struggle motion to suggest triggering an alert automatically.",
    request: async () => {
      if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
        try {
          const res = await DeviceMotionEvent.requestPermission();
          return res === "granted" ? "granted" : "denied";
        } catch {
          return "denied";
        }
      }
      return "granted"; // Android / browsers without explicit gating
    }
  },
  {
    id: "calls-sms",
    icon: faComment,
    title: "Calls & SMS",
    body: "Lets ASAP-SOS pre-fill your dialer and messages app so you can confirm and send with one tap.",
    request: async () => "granted" // web can't truly request this; tel:/sms: links handle it per-action
  },
  {
    id: "overlay",
    icon: faWindowRestore,
    title: "Display over other apps",
    body: "Available once you install the native app — lets the panic trigger work even when your screen is locked.",
    request: async () => "unsupported"
  }
];

export default function PermissionsFlow({ onDone }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState(false);
  const perm = PERMISSIONS[index];
  const isLast = index === PERMISSIONS.length - 1;

  const handleAllow = async () => {
    setBusy(true);
    const result = await perm.request();
    setResults((r) => ({ ...r, [perm.id]: result }));
    setBusy(false);
    advance();
  };

  const handleSkip = () => {
    setResults((r) => ({ ...r, [perm.id]: "skipped" }));
    advance();
  };

  const advance = () => {
    if (isLast) onDone(results);
    else setIndex((i) => i + 1);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0B0E14",
        display: "flex",
        flexDirection: "column",
        zIndex: 997,
        padding: "0 28px"
      }}
    >
      <div style={{ paddingTop: 32, display: "flex", gap: 6 }}>
        {PERMISSIONS.map((p, i) => (
          <div
            key={p.id}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 2,
              background: i <= index ? "#D7263D" : "#2A3242"
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "#D7263D1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24
          }}
        >
          <FontAwesomeIcon icon={perm.icon} style={{ fontSize: 26, color: "#D7263D" }} />
        </div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Permission {index + 1} of {PERMISSIONS.length}
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, margin: "0 0 10px" }}>
          {perm.title}
        </h2>
        <p style={{ color: "#93A0B4", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{perm.body}</p>
      </div>

      <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
        <button className="btn btn-ghost" onClick={handleSkip} disabled={busy}>
          Not now
        </button>
        <button className="btn btn-primary btn-block" onClick={handleAllow} disabled={busy}>
          {busy ? "Requesting…" : "Allow"}
          {!busy && <FontAwesomeIcon icon={faCheck} style={{ fontSize: 12 }} />}
        </button>
      </div>
    </div>
  );
}
