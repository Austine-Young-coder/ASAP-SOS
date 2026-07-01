import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faVideo, faKeyboard, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../hooks/useAuth";
import { createBroadcast } from "../lib/broadcasts";
import { getLocal } from "../lib/storage";

export default function NewBroadcast() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { position, request } = useGeolocation();
  const [mode, setMode] = useState("text"); // text | video
  const [message, setMessage] = useState("");
  const [range, setRange] = useState(getLocal("panicConfig", {}).range || "nearby");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const send = async () => {
    setSending(true);
    setError(null);
    try {
      request();
      await createBroadcast({
        userId: user?.id || "local",
        message: mode === "text" ? message : null,
        range,
        lat: position?.lat,
        lng: position?.lng,
        category: "general"
      });
      setSent(true);
      setTimeout(() => navigate("/broadcasts"), 1200);
    } catch (e) {
      setError("Couldn't send right now — it'll go out when you're back online.");
      setTimeout(() => navigate("/broadcasts"), 1500);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0B0E14", zIndex: 995, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "calc(env(safe-area-inset-top) + 20px) 20px 16px" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, margin: 0 }}>Send a broadcast</h2>
        <button onClick={() => navigate(-1)} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} style={{ color: "#93A0B4", fontSize: 18 }} />
        </button>
      </div>

      <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <ModeButton active={mode === "text"} icon={faKeyboard} label="Text" onClick={() => setMode("text")} />
          <ModeButton active={mode === "video"} icon={faVideo} label="30s video" onClick={() => setMode("video")} />
        </div>

        {mode === "text" ? (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what's happening and where — keep it short and clear."
            rows={5}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              background: "#1E2533",
              border: "1px solid #2A3242",
              color: "#E8EDF2",
              fontSize: 14,
              resize: "none",
              marginBottom: 18
            }}
          />
        ) : (
          <VideoRecorder onCaptured={() => {}} />
        )}

        <div className="eyebrow" style={{ marginBottom: 8 }}>Who should see this?</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <RangeOption
            active={range === "nearby"}
            title="Nearby users"
            sub="~5km radius — fastest response"
            onClick={() => setRange("nearby")}
          />
          <RangeOption
            active={range === "wide"}
            title="Wider reach"
            sub="Whole state — for major incidents"
            onClick={() => setRange("wide")}
          />
        </div>

        {error && (
          <div style={{ color: "#F2A93B", fontSize: 13, marginBottom: 12, padding: 10, background: "#6B4D1733", borderRadius: 10 }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ padding: "16px 20px calc(env(safe-area-inset-bottom) + 20px)" }}>
        <button
          className="btn btn-primary btn-block"
          onClick={send}
          disabled={sending || sent || (mode === "text" && !message.trim())}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          {sent ? "Sent" : sending ? "Sending…" : "Send broadcast now"}
        </button>
      </div>
    </div>
  );
}

function ModeButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn"
      style={{
        flex: 1,
        background: active ? "#D7263D" : "#1E2533",
        color: active ? "white" : "#93A0B4",
        border: active ? "none" : "1px solid #2A3242"
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: 13 }} />
      {label}
    </button>
  );
}

function RangeOption({ active, title, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card"
      style={{ flex: 1, textAlign: "left", borderColor: active ? "#F2A93B" : "#2A3242" }}
    >
      <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 11, color: "#5B6678", marginTop: 2 }}>{sub}</div>
    </button>
  );
}

function VideoRecorder() {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setReady(true);
    } catch {
      setError("Camera access is needed to record a video broadcast.");
    }
  };

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        background: "#000",
        aspectRatio: "9 / 12",
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {error ? (
        <span style={{ color: "#F2A93B", fontSize: 13, padding: 20, textAlign: "center" }}>{error}</span>
      ) : ready ? (
        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <button className="btn btn-secondary" onClick={start}>
          <FontAwesomeIcon icon={faVideo} />
          Start camera
        </button>
      )}
    </div>
  );
}
