import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPhoneVolume, faBullhorn, faGear } from "@fortawesome/free-solid-svg-icons";

const TABS = [
  { to: "/", icon: faHouse, label: "Home", end: true },
  { to: "/call", icon: faPhoneVolume, label: "Call" },
  { to: "/broadcasts", icon: faBullhorn, label: "Alerts" },
  { to: "/settings", icon: faGear, label: "Settings" }
];

export default function BottomNav() {
  return (
    <nav
      style={{
        position: "sticky",
        bottom: 0,
        display: "flex",
        background: "rgba(11,14,20,0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid #2A3242",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))"
      }}
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          style={({ isActive }) => ({
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "10px 0 6px",
            color: isActive ? "#D7263D" : "#5B6678",
            textDecoration: "none"
          })}
        >
          <FontAwesomeIcon icon={tab.icon} style={{ fontSize: 18 }} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
