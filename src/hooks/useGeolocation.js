import { useCallback, useEffect, useState } from "react";
import { getLocal, setLocal } from "../lib/storage";

export function useGeolocation({ watch = false } = {}) {
  const [position, setPosition] = useState(() => getLocal("lastPosition"));
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | locating | granted | denied

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Location isn't available on this device.");
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        setLocal("lastPosition", coords);
        setStatus("granted");
        setError(null);
      },
      (err) => {
        setError(err.message || "Couldn't get your location.");
        setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    if (!watch || !("geolocation" in navigator)) return undefined;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        setLocal("lastPosition", coords);
        setStatus("granted");
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 30000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [watch]);

  return { position, error, status, request };
}
