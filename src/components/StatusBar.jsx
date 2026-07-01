import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faWifi, faSignal } from "@fortawesome/free-solid-svg-icons";

export default function StatusBar({ stateName, locating }) {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "calc(env(safe-area-inset-top) + 14px) 20px 0"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#93A0B4", fontSize: 12 }}>
        <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 11, color: locating ? "#F2A93B" : "#1AAE6F" }} />
        <span className="mono">{locating ? "Locating…" : stateName || "Location unknown"}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: online ? "#1AAE6F" : "#F2A93B", fontSize: 12 }}>
        <FontAwesomeIcon icon={online ? faWifi : faSignal} style={{ fontSize: 11 }} />
        <span className="mono">{online ? "Online" : "Offline mode"}</span>
      </div>
    </div>
  );
}
