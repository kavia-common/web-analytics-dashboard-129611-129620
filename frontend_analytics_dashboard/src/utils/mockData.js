/**
 * Utilities to generate mocked analytics data.
 */

const devices = ["Desktop", "Mobile", "Tablet"];
const browsers = ["Chrome", "Safari", "Firefox", "Edge", "Other"];
const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "AU", name: "Australia" },
  { code: "ZA", name: "South Africa" },
  { code: "JP", name: "Japan" },
];

const pages = [
  "/",
  "/blog",
  "/blog/how-to-use-our-product",
  "/pricing",
  "/signup",
  "/login",
  "/docs",
  "/docs/getting-started",
  "/contact",
  "/about",
];

let seed = 42;
function rnd() {
  // simple LCG for deterministic random
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
function randint(min, max) {
  return Math.floor(rnd() * (max - min + 1)) + min;
}
function rfloat(min, max) {
  return rnd() * (max - min) + min;
}

export function generateTimeSeries(minutes = 60) {
  const pts = [];
  let base = randint(20, 70);
  for (let i = minutes - 1; i >= 0; i--) {
    base = Math.max(0, base + randint(-6, 6));
    pts.push({
      t: Date.now() - i * 60 * 1000,
      v: base + randint(-5, 5),
    });
  }
  return pts;
}

export function mutateSeries(series, step = 1) {
  // slide one step and add a new point
  const s = series.slice(step);
  const last = series[series.length - 1]?.v ?? 20;
  const next = Math.max(0, last + randint(-6, 6));
  s.push({ t: Date.now(), v: next });
  return s;
}

export function generateBreakdown(labels, total = 100) {
  const weights = labels.map(() => Math.max(1, rfloat(0.5, 2)));
  const sum = weights.reduce((a, b) => a + b, 0);
  return labels.map((label, i) => {
    const value = Math.round((weights[i] / sum) * total);
    return { label, value };
  });
}

export function generateDevices() {
  return generateBreakdown(devices, 100);
}

export function generateBrowsers() {
  return generateBreakdown(browsers, 100);
}

export function generateGeo(limit = 8) {
  const shuffled = countries
    .map((c) => ({ ...c, r: rnd() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, limit);
  return shuffled.map((c) => ({ country: c.name, code: c.code, visitors: randint(50, 800) }));
}

export function generateTopPages(limit = 8) {
  const shuffled = pages
    .map((p) => ({ path: p, r: rnd() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, limit);
  return shuffled.map((p, idx) => ({
    rank: idx + 1,
    path: p.path,
    views: randint(200, 4000),
    avgTime: randint(20, 220), // seconds
    bounce: randint(20, 75), // percent
  }));
}

export function summarize(series) {
  const total = series.reduce((acc, p) => acc + p.v, 0);
  const avg = Math.round(total / Math.max(1, series.length));
  const current = series[series.length - 1]?.v ?? 0;
  const prev = series[series.length - 2]?.v ?? 0;
  const delta = current - prev;
  const trendPct = prev ? Math.round((delta / prev) * 100) : 0;
  return { current, avg, total, trendPct };
}
