import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faComments,
  faVideo,
  faListCheck,
  faCheck,
  faChevronRight,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { getLocal, setLocal } from "../lib/storage";
import { useAuth } from "../hooks/useAuth";

const ACTIONS = [
  {
    id: "call",
    icon: faPhone,
    title: "Call an emergency number",
    body: "Holding SOS immediately opens your dialer with your saved emergency number ready to call."
  },
  {
    id: "broadcast",
    icon: faComments,
    title: "Open a broadcast message",
    body: "Holding SOS opens a text box to send a broadcast to nearby ASAP-SOS users asking for help."
  },
  {
    id: "video",
    icon: faVideo,
    title: "Record video evidence",
    body: "Holding SOS opens your camera and starts recording, saving the video to your device immediately."
  },
  {
    id: "choose",
    icon: faListCheck,
    title: "Ask me every time",
    body: "Holding SOS opens a quick menu so you can pick the right action in the moment."
  }
];

export default function Settings() {
  const { user, signOut } = useAuth();
  const [config, setConfig] = useState(() => getLocal("panicConfig", { action: "choose", number: "" }));

  const update = (patch) => {
    const next = { ...config, ...patch };
    setConfig(next);
    setLocal("panicConfig", next);
  };

  return (
    <div style={{ padding: "calc(env(safe-area-inset-top) + 20px) 20px 24px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, margin: "0 0 4px" }}>
        Settings
      </h1>
      <p style={{ color: "#93A0B4", fontSize: 14, margin: "0 0 24px" }}>
        Choose what happens when you hold the SOS button.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {ACTIONS.map((a) => {
          const selected = config.action === a.id;
          return (
            <button
              key={a.id}
              className="card"
              onClick={() => update({ action: a.id })}
              style={{
                display: "flex",
                gap: 14,
                textAlign: "left",
                borderColor: selected ? "#D7263D" : "#2A3242",
                background: selected ? "#D7263D0D" : "#161B26"
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: selected ? "#D7263D" : "#1E2533",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <FontAwesomeIcon icon={a.icon} style={{ color: selected ? "white" : "#93A0B4", fontSize: 15 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#5B6678", marginTop: 3, lineHeight: 1.5 }}>{a.body}</div>
              </div>
              {selected && <FontAwesomeIcon icon={faCheck} style={{ color: "#D7263D", fontSize: 14, flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>

      {config.action === "call" && (
        <div className="card" style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 13, color: "#93A0B4", display: "block", marginBottom: 8 }}>
            Number to call on trigger
          </label>
          <input
            type="tel"
            value={config.number || ""}
            onChange={(e) => update({ number: e.target.value })}
            placeholder="e.g. 112 or a trusted contact"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              background: "#1E2533",
              border: "1px solid #2A3242",
              color: "#E8EDF2",
              fontSize: 14
            }}
          />
        </div>
      )}

      <div className="eyebrow" style={{ marginBottom: 10 }}>Broadcast range</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        {[
          { id: "nearby", label: "Nearby only", sub: "~5km radius" },
          { id: "wide", label: "Wider reach", sub: "Whole state" }
        ].map((opt) => (
          <button
            key={opt.id}
            className="card"
            style={{
              flex: 1,
              borderColor: config.range === opt.id ? "#F2A93B" : "#2A3242",
              textAlign: "left"
            }}
            onClick={() => update({ range: opt.id })}
          >
            <div style={{ fontWeight: 600, fontSize: 13 }}>{opt.label}</div>
            <div style={{ fontSize: 11, color: "#5B6678", marginTop: 2 }}>{opt.sub}</div>
          </button>
        ))}
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Account</div>
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#1E2533",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "#93A0B4"
          }}
        >
          {(user?.email || "U")[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.email || "Local profile"}</div>
          <div style={{ fontSize: 12, color: "#5B6678" }}>Signed in via {user?.app_metadata?.provider || "device"}</div>
        </div>
      </div>
      <button className="btn btn-secondary btn-block" onClick={signOut} style={{ color: "#D7263D" }}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        Sign out
      </button>
    </div>
  );
}
