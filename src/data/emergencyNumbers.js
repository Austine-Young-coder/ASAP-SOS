// Nigeria emergency contacts.
// National short-codes are toll-free on all networks.
// State lines are direct 11-digit mobile numbers to state control rooms/police commands.
// Sourced and compiled June 2026. Verify periodically — numbers do change.

export const NATIONAL_LINES = [
  {
    id: "national-112",
    name: "National Emergency Number (NEMA)",
    number: "112",
    category: "general",
    note: "Connects to police, fire and medical response anywhere in Nigeria. Toll-free."
  },
  {
    id: "national-122",
    name: "Federal Road Safety Corps (FRSC)",
    number: "122",
    category: "road",
    note: "Road accidents, breakdowns, reckless driving. Toll-free."
  },
  {
    id: "national-nema",
    name: "NEMA Disaster Hotline",
    number: "08002255362",
    category: "disaster",
    note: "Floods, building collapse, large-scale disasters. Toll-free."
  },
  {
    id: "national-fire",
    name: "Federal Fire Service",
    number: "08032003557",
    category: "fire",
    note: "National fire emergency dispatch."
  },
  {
    id: "national-era",
    name: "Emergency Response Africa",
    number: "08000022553",
    category: "medical",
    note: "Private rapid-response medical and ambulance service."
  },
  {
    id: "national-ndlea",
    name: "NDLEA Drug Crime Line",
    number: "08001020304",
    category: "security",
    note: "Report drug-related crime or get rehab support."
  },
  {
    id: "national-dsvrt",
    name: "Domestic & Sexual Violence Response",
    number: "08003333333",
    category: "gbv",
    note: "Toll-free. Immediate intervention, legal advice, psychological support."
  },
  {
    id: "national-mental-health",
    name: "Suicide Prevention & Mental Health",
    number: "09084393373",
    category: "mental-health",
    note: "Confidential support for mental health crises."
  }
];

// State control room hotlines — connect directly to local police command / rapid-response unit.
export const STATE_LINES = {
  Adamawa: ["08089671313"],
  Bauchi: ["08151849417", "08127162434", "08084763669"],
  Benue: ["08066006475", "08053039936", "07075390677"],
  Borno: ["08068075581", "08036071667", "08123823322"],
  "FCT (Abuja)": ["07057337653", "08061581938", "08032003913"],
  Gombe: ["08150567771", "08151855014"],
  Jigawa: ["08075391069", "07089846285", "08123821598"],
  Kaduna: ["08123822284"],
  Kano: ["08032419754", "08123821575"],
  Katsina: ["08075391255", "08075391250"],
  Kebbi: ["08038797644", "08075391307"],
  Kogi: ["08075391335", "07038329084"],
  Kwara: ["07032069501", "08125275046"],
  Nasarawa: ["08123821571", "07075391560"],
  Niger: ["08081777498", "08127185198"],
  Plateau: ["08126375938", "08075391844", "08038907662"],
  Sokoto: ["07068848035", "08075391943"],
  Taraba: ["08140089863", "08073260267"],
  Yobe: ["07039301585", "08035067570"],
  Zamfara: ["08106580123"],
  Abia: ["08035415408", "08079210003", "08079210004"],
  "Akwa Ibom": ["08039213071", "08020913810"],
  Anambra: ["07039194332", "08024922772", "08075390511"],
  Bayelsa: ["07034578208"],
  "Cross River": ["08133568456", "07053355415"],
  Delta: ["08036684974"],
  Ebonyi: ["07064515001", "08125273721", "08084704673"],
  Edo: ["08037646272", "08077773721", "08067551618"],
  Ekiti: ["08062335577", "07089310359"],
  Enugu: ["08032003702", "08075390883", "08086671202"],
  Imo: ["08034773600", "08037037283"],
  Lagos: ["767", "07055462708", "08035963919"],
  Ogun: ["08032136765", "08081770416"],
  Ondo: ["07034313903", "08075391808"],
  Osun: ["08075872433", "08039537995", "08123823981"],
  Oyo: ["08081768614", "08150777888"],
  Rivers: ["08032003514", "08073777717"]
};

// Approximate state centroid coordinates, used to find nearest state from device GPS
// when reverse-geocoding isn't available offline.
export const STATE_COORDS = {
  Adamawa: [9.3265, 12.3984],
  Bauchi: [10.7726, 9.9988],
  Benue: [7.3369, 8.7404],
  Borno: [11.8333, 13.15],
  "FCT (Abuja)": [9.0765, 7.3986],
  Gombe: [10.2897, 11.1673],
  Jigawa: [12.2281, 9.5616],
  Kaduna: [10.5167, 7.4333],
  Kano: [12.0022, 8.592],
  Katsina: [12.9908, 7.6018],
  Kebbi: [12.4504, 4.1996],
  Kogi: [7.7337, 6.6906],
  Kwara: [8.967, 4.3874],
  Nasarawa: [8.5378, 8.3206],
  Niger: [9.93, 5.5979],
  Plateau: [9.2182, 9.5179],
  Sokoto: [13.0059, 5.2476],
  Taraba: [7.9994, 10.7744],
  Yobe: [12.2939, 11.439],
  Zamfara: [12.1704, 6.2604],
  Abia: [5.4527, 7.5248],
  "Akwa Ibom": [5.0077, 7.85],
  Anambra: [6.2107, 6.9367],
  Bayelsa: [4.9267, 6.2676],
  "Cross River": [5.8702, 8.5988],
  Delta: [5.5333, 5.95],
  Ebonyi: [6.2649, 8.0137],
  Edo: [6.6342, 5.9304],
  Ekiti: [7.7167, 5.3119],
  Enugu: [6.5244, 7.5112],
  Imo: [5.572, 7.0588],
  Lagos: [6.5244, 3.3792],
  Ogun: [7.16, 3.35],
  Ondo: [7.25, 5.2],
  Osun: [7.5629, 4.52],
  Oyo: [8.1574, 3.6147],
  Rivers: [4.8156, 6.9778]
};

const toRad = (deg) => (deg * Math.PI) / 180;

function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Returns the nearest Nigerian state name to a given {lat, lng}. */
export function nearestState(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const [state, coords] of Object.entries(STATE_COORDS)) {
    const d = haversineKm([lat, lng], coords);
    if (d < bestDist) {
      bestDist = d;
      best = state;
    }
  }
  return best;
}

/** Returns category-filtered national lines plus the nearest state's lines. */
export function getRelevantLines({ lat, lng, category }) {
  const state = lat != null && lng != null ? nearestState(lat, lng) : null;
  const national = category
    ? NATIONAL_LINES.filter((l) => l.category === category || l.category === "general")
    : NATIONAL_LINES;
  const stateNumbers = state ? STATE_LINES[state] || [] : [];
  return { state, national, stateNumbers };
}

export const EMERGENCY_CATEGORIES = [
  { id: "general", label: "General / Unsure", icon: "circle-exclamation" },
  { id: "security", label: "Crime / Banditry / Kidnapping", icon: "user-shield" },
  { id: "fire", label: "Fire", icon: "fire" },
  { id: "medical", label: "Medical / Ambulance", icon: "kit-medical" },
  { id: "disaster", label: "Flood / Building Collapse / Disaster", icon: "house-chimney-crack" },
  { id: "road", label: "Road Accident", icon: "car-burst" },
  { id: "gbv", label: "Domestic / Sexual Violence", icon: "hand-holding-heart" },
  { id: "mental-health", label: "Mental Health Crisis", icon: "brain" }
];
