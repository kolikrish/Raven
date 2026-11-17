
// The studio's name, contact details and studios in one place. Change these to rebrand the
// template: the header, menu, footer, contact page, map and globe all read from here.
export const BRAND = {
  name: "Raven",
  mark: "Raven®",
  email: "hello@raven.studio",
  cities: "Oslo and Lisbon",
};

export type Studio = {
  city: string;
  country: string;
  zone: string;
  address: [string, string];
  lat: number;
  lon: number;
  // Local opening hours, 24h clock
  opens: number;
  closes: number;
};

export const STUDIOS: Studio[] = [
  {
    city: "Oslo",
    country: "Norway",
    zone: "Europe/Oslo",
    address: ["Thorvald Meyers gate 47", "0555 Oslo"],
    lat: 59.923,
    lon: 10.759,
    opens: 9,
    closes: 17,
  },
  {
    city: "Lisbon",
    country: "Portugal",
    zone: "Europe/Lisbon",
    address: ["Rua da Boavista 84", "1200-066 Lisboa"],
    lat: 38.708,
    lon: -9.15,
    opens: 10,
    closes: 18,
  },
];

// The time in a studio's city, and whether the studio is open right now (weekdays only)
export const studioClock = (studio: Studio, now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
    timeZone: studio.zone,
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = Number(get("hour"));
  const weekend = ["Sat", "Sun"].includes(get("weekday"));
  const open = !weekend && hour >= studio.opens && hour < studio.closes;
  return { time: `${get("hour")}:${get("minute")}`, open };
};
