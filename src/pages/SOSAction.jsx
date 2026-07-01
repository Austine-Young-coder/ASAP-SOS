import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faComments, faVideo, faListCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function SOSAction() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const config = state?.config || { action: "choose" };
  const [action, setAction] = useState(config.action === "choose" ? null : config.action);

  if (!action) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#0B0E14", zIndex: 996, padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "calc(env(safe-area-inset-top) + 20px) 0 20px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, margin: 0, color: "#D7263D" }}>
            What do you need?
          </h2>
          <button onClick={() => navigate(-1)} aria-label="Cancel">
            <FontAwesomeIcon icon={faXmark} style={{ color: "#93A0B4", fontSize: 18 }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Choice icon={faPhone} label="Call emergency number" onClick={() => navigate("/call")} />
          <Choice icon={faComments} label="Send broadcast message" onClick={() => navigate("/broadcast/new")} />
          <Choice icon={faVideo} label="Record video now" onClick={() => setAction("video")} />
        </div>
      </div>
    );
  }

  if (action === "call") return <CallRedirect number={config.number} navigate={navigate} />;
  if (action === "broadcast") return <BroadcastRedirect navigate={navigate} />;
  if (action === "video") return <VideoCapture navigate={navigate} />;

  return null;
}

function Choice({ icon, label, onClick }) {
  return (
    <button className="card" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
      <FontAwesomeIcon icon={icon} style={{ color: "#D7263D", fontSize: 16, width: 20 }} />
      <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
    </button>
  );
}

function CallRedirect({ number, navigate }) {
  useEffect(() => {
    const target = number || "112";
    window.location.href = `tel:${target}`;
    const t = setTimeout(() => navigate("/"), 1500);
    return () => clearTimeout(t);
  }, [number, navigate]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#D7263D", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 996 }}>
      <div style={{ textAlign: "center", color: "white" }}>
        <FontAwesomeIcon icon={faPhone} style={{ fontSize: 36, marginBottom: 12 }} />
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18 }}>Calling {number || "112"}…</div>
      </div>
    </div>
  );
}

function BroadcastRedirect({ navigate }) {
  useEffect(() => {
    navigate("/broadcast/new", { replace: true });
  }, [navigate]);
  return null;
}

function VideoCapture({ navigate }) {
  const videoRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream);
        mediaRef.current = recorder;
        recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `asap-sos-${Date.now()}.webm`;
          a.click();
          setSaved(true);
        };
        recorder.start();
        setRecording(true);
        setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
          setRecording(false);
        }, 30000);
      } catch (e) {
        setError("Camera access is needed to record. Check your permissions.");
      }
    })();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 996, display: "flex", flexDirection: "column" }}>
      {error ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", color: "#F2A93B" }}>
          {error}
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline muted style={{ flex: 1, objectFit: "cover", width: "100%" }} />
      )}
      <div style={{ padding: "20px calc(env(safe-area-inset-bottom) + 20px) 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="mono" style={{ color: recording ? "#D7263D" : "#1AAE6F", fontSize: 13 }}>
          {recording ? "● Recording — saves automatically" : saved ? "Saved to your device" : "Ready"}
        </span>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Done
        </button>
      </div>
    </div>
  );
}
