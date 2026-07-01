const PREFIX = "asapsos:";

export function getLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocal(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently, app still works in-memory
  }
}

export function removeLocal(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}

// Simple offline outbox: queue actions (broadcasts, reports) made while offline
// so they can sync once connectivity returns.
const OUTBOX_KEY = "outbox";

export function queueOfflineAction(action) {
  const outbox = getLocal(OUTBOX_KEY, []);
  outbox.push({ ...action, queuedAt: Date.now() });
  setLocal(OUTBOX_KEY, outbox);
}

export function getOutbox() {
  return getLocal(OUTBOX_KEY, []);
}

export function clearOutbox() {
  setLocal(OUTBOX_KEY, []);
}
