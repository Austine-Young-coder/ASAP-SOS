import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solid from "@fortawesome/free-solid-svg-icons";
import { faPhone, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useGeolocation } from "../hooks/useGeolocation";
import { EMERGENCY_CATEGORIES, getRelevantLines } from "../data/emergencyNumbers";

export default function Call() {
  const { position, status, request } = useGeolocation();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    request();
  }, [request]);

  const { state, national, stateNumbers } = getRelevantLines({
    lat: position?.lat,
    lng: position?.lng,
    category: category?.id
  });

  return (
    <div style={{ padding: "calc(env(safe-area-inset-top) + 20px) 20px 24px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, margin: "0 0 4px" }}>
        Who do you need?
      </h1>
      <p style={{ color: "#93A0B4", fontSize: 14, margin: "0 0 20px" }}>
        {status === "locating"
          ? "Finding your location…"
          : state
          ? `Showing responders closest to ${state}.`
          : "Turn on location for the responder nearest you."}
      </p>

      {!category ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EMERGENCY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="card"
              onClick={() => setCategory(cat)}
              style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#D7263D1A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <FontAwesomeIcon icon={solid[toCamel(cat.icon)] || faPhone} style={{ color: "#D7263D", fontSize: 16 }} />
              </div>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{cat.label}</span>
              <FontAwesomeIcon icon={faChevronRight} style={{ color: "#5B6678", fontSize: 12 }} />
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setCategory(null)}
            className="btn btn-ghost"
            style={{ padding: 0, marginBottom: 16, fontSize: 13 }}
          >
            ← Choose a different emergency
          </button>

          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {category.label}
          </div>

          {stateNumbers.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#93A0B4", marginBottom: 10 }}>
                Nearest — {state}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stateNumbers.map((num) => (
                  <CallRow key={num} name={`${state} control room`} number={num} primary />
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: 13, color: "#93A0B4", marginBottom: 10 }}>National lines</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {national.map((line) => (
              <CallRow key={line.id} name={line.name} number={line.number} note={line.note} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CallRow({ name, number, note, primary }) {
  return (
    <a
      href={`tel:${number}`}
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        textDecoration: "none",
        borderColor: primary ? "#D7263D" : "#2A3242"
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: primary ? "#D7263D" : "#1E2533",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        <FontAwesomeIcon icon={faPhone} style={{ color: primary ? "white" : "#93A0B4", fontSize: 14 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#E8EDF2" }}>{name}</div>
        <div className="mono" style={{ fontSize: 13, color: "#93A0B4" }}>{number}</div>
        {note && <div style={{ fontSize: 11, color: "#5B6678", marginTop: 2 }}>{note}</div>}
      </div>
    </a>
  );
}

function toCamel(kebab) {
  return "fa" + kebab.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
}
