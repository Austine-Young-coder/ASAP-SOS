import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../hooks/useAuth";

export default function SignIn({ onSignedIn }) {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null); // 'google' | 'apple' | null

  const handle = async (provider) => {
    setError(null);
    setBusy(provider);
    try {
      if (provider === "google") await signInWithGoogle();
      else await signInWithApple();
      // OAuth redirect takes over from here; for local/dev fallback without
      // Supabase configured, surface a clear message instead of hanging.
    } catch (e) {
      setError(e.message);
      setBusy(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0B0E14",
        display: "flex",
        flexDirection: "column",
        zIndex: 998,
        padding: "0 28px"
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#D7263D",
            marginBottom: 24
          }}
        />
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26,
            margin: "0 0 8px",
            color: "#E8EDF2"
          }}
        >
          Welcome to ASAP-SOS
        </h1>
        <p style={{ color: "#93A0B4", fontSize: 15, lineHeight: 1.6, margin: "0 0 36px" }}>
          Sign in to set up your emergency profile, panic trigger, and reach people nearby when it matters.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            className="btn btn-block"
            onClick={() => handle("google")}
            disabled={busy !== null}
            style={{
              background: "#FFFFFF",
              color: "#1F1F1F",
              opacity: busy && busy !== "google" ? 0.5 : 1
            }}
          >
            <FontAwesomeIcon icon={faGoogle} />
            {busy === "google" ? "Connecting…" : "Continue with Google"}
          </button>
          <button
            className="btn btn-block"
            onClick={() => handle("apple")}
            disabled={busy !== null}
            style={{
              background: "#000000",
              color: "#FFFFFF",
              border: "1px solid #2A3242",
              opacity: busy && busy !== "apple" ? 0.5 : 1
            }}
          >
            <FontAwesomeIcon icon={faApple} />
            {busy === "apple" ? "Connecting…" : "Continue with Apple"}
          </button>
        </div>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              background: "#6B4D1733",
              border: "1px solid #F2A93B",
              color: "#F2A93B",
              fontSize: 13,
              lineHeight: 1.5
            }}
          >
            {error}
            <button
              className="btn btn-ghost"
              style={{ display: "block", marginTop: 8, padding: 0, color: "#93A0B4", fontSize: 13 }}
              onClick={() => onSignedIn({ id: "local-demo", email: null, demo: true })}
            >
              Continue without an account →
            </button>
          </div>
        )}
      </div>

      <p style={{ textAlign: "center", color: "#5B6678", fontSize: 12, padding: "20px 0" }}>
        By continuing you agree to share your location during active alerts.
      </p>
    </div>
  );
}
