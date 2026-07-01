import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faFlag, faLocationDot, faVideo } from "@fortawesome/free-solid-svg-icons";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../hooks/useAuth";
import { fetchNearbyBroadcasts, reportBroadcast } from "../lib/broadcasts";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function Broadcasts() {
  const { position, request } = useGeolocation();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reported, setReported] = useState({});

  useEffect(() => {
    request();
  }, [request]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await fetchNearbyBroadcasts({ lat: position?.lat, lng: position?.lng });
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [position]);

  const handleReport = async (id) => {
    setReported((r) => ({ ...r, [id]: true }));
    try {
      await reportBroadcast({ broadcastId: id, reporterId: user?.id || "local", reason: "false_alarm" });
    } catch {
      /* surfaced via offline queue */
    }
  };

  return (
    <div style={{ padding: "calc(env(safe-area-inset-top) + 20px) 20px 24px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, margin: "0 0 4px" }}>
        Nearby alerts
      </h1>
      <p style={{ color: "#93A0B4", fontSize: 14, margin: "0 0 20px" }}>
        Broadcasts from ASAP-SOS users around you.
      </p>

      {loading ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((b) => (
            <BroadcastCard key={b.id} item={b} onReport={() => handleReport(b.id)} reported={!!reported[b.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

function BroadcastCard({ item, onReport, reported }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ borderColor: "#D7263D55" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", gap: 12, width: "100%", textAlign: "left" }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#D7263D1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            animation: "asap-pulse 1.6s infinite"
          }}
        >
          <FontAwesomeIcon icon={item.video_url ? faVideo : faBullhorn} style={{ color: "#D7263D", fontSize: 14 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>
            {item.category ? item.category.replace("-", " ") : "Emergency"} · {timeAgo(item.created_at)}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#93A0B4",
              marginTop: 3,
              overflow: open ? "visible" : "hidden",
              textOverflow: open ? "clip" : "ellipsis",
              whiteSpace: open ? "normal" : "nowrap"
            }}
          >
            {item.message || (item.video_url ? "Video broadcast — tap to view" : "No description provided")}
          </div>
        </div>
      </button>

      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #2A3242" }}>
          {item.lat && item.lng && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5B6678", marginBottom: 10 }}>
              <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 11 }} />
              <span className="mono">{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</span>
            </div>
          )}
          {item.video_url && (
            <video src={item.video_url} controls style={{ width: "100%", borderRadius: 10, marginBottom: 10 }} />
          )}
          <button
            className="btn btn-ghost"
            onClick={onReport}
            disabled={reported}
            style={{ fontSize: 12, color: reported ? "#5B6678" : "#F2A93B", padding: 0 }}
          >
            <FontAwesomeIcon icon={faFlag} style={{ fontSize: 11 }} />
            {reported ? "Reported — thank you" : "Report as false alarm"}
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
      <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: 22, color: "#5B6678", marginBottom: 12 }} />
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>No active alerts nearby</div>
      <div style={{ fontSize: 12, color: "#5B6678" }}>You'll see broadcasts here the moment someone nearby needs help.</div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="card" style={{ height: 62, opacity: 0.4 }} />
      ))}
    </div>
  );
}
