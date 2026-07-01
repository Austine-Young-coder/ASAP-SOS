import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume, faBullhorn, faFlag, faWhatsapp } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp as faWhatsappBrand } from "@fortawesome/free-brands-svg-icons";
import SOSButton from "../components/SOSButton";
import StatusBar from "../components/StatusBar";
import { useGeolocation } from "../hooks/useGeolocation";
import { nearestState } from "../data/emergencyNumbers";
import { getLocal } from "../lib/storage";

const WHATSAPP_HELP_URL = "https://wa.me/2348109352330";

export default function Home() {
  const navigate = useNavigate();
  const { position, status, request } = useGeolocation({ watch: true });
  const [stateName, setStateName] = useState(null);
  const panicConfig = getLocal("panicConfig", { action: "choose" });

  useEffect(() => {
    request();
  }, [request]);

  useEffect(() => {
    if (position) setStateName(nearestState(position.lat, position.lng));
  }, [position]);

  const handleSOSTrigger = () => {
    navigate("/sos-action", { state: { config: panicConfig } });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StatusBar stateName={stateName} locating={status === "locating"} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px 8px" }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          Press and hold for 1.5 seconds
        </div>
        <SOSButton onTrigger={handleSOSTrigger} />
        <p style={{ color: "#5B6678", fontSize: 12, marginTop: 18, textAlign: "center", maxWidth: 260, lineHeight: 1.5 }}>
          Holding sends your set emergency action. Tap below for a specific responder instead.
        </p>
      </div>

      <div style={{ padding: "12px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <ActionTile
          icon={faPhoneVolume}
          label="Call a responder"
          sub="Police, fire, medical & more"
          color="#1AAE6F"
          onClick={() => navigate("/call")}
        />
        <ActionTile
          icon={faBullhorn}
          label="Broadcast alert"
          sub="Text or 30s video to others"
          color="#F2A93B"
          onClick={() => navigate("/broadcast/new")}
        />
        <ActionTile
          icon={faFlag}
          label="Report false alarm"
          sub="Flag a misused broadcast"
          color="#93A0B4"
          onClick={() => navigate("/broadcasts")}
        />
        <ActionTile
          icon={faWhatsappBrand}
          label="Get help"
          sub="Chat with us on WhatsApp"
          color="#1AAE6F"
          onClick={() => window.open(WHATSAPP_HELP_URL, "_blank", "noopener")}
        />
      </div>

      <div style={{ padding: "8px 20px 24px" }} />
    </div>
  );
}

function ActionTile({ icon, label, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        textAlign: "left"
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `${color}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FontAwesomeIcon icon={icon} style={{ color, fontSize: 16 }} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#E8EDF2" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#5B6678", marginTop: 2 }}>{sub}</div>
      </div>
    </button>
  );
}
