import React, { useEffect, useMemo, useState } from "react";
import "./theme.css";
import {
  generateTimeSeries,
  mutateSeries,
  summarize,
  generateDevices,
  generateBrowsers,
  generateGeo,
  generateTopPages,
} from "./utils/mockData";
import { LineAreaChart, DonutChart, BarChart } from "./components/Charts";
import { getConfig } from "./utils/config";

/** Icons */
const Icon = ({ children }) => (
  <div className="icon" aria-hidden>{children}</div>
);

/**
/* PUBLIC_INTERFACE
 * DateRangePicker - simple date range selector
 */
export function DateRangePicker({ range, onChange }) {
  /** This component allows selecting preset ranges or a custom range via date inputs. */
  const [mode, setMode] = useState(range.preset || "7d");
  const [from, setFrom] = useState(range.from || "");
  const [to, setTo] = useState(range.to || "");

  useEffect(() => {
    if (mode !== "custom") {
      onChange({ preset: mode });
    } else {
      onChange({ preset: "custom", from, to });
    }
  }, [mode, from, to]); // eslint-disable-line

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select
        className="select"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        aria-label="Select date range"
      >
        <option value="24h">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="custom">Custom</option>
      </select>
      {mode === "custom" && (
        <>
          <input
            className="input"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
          />
          <span className="row-muted">to</span>
          <input
            className="input"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
          />
        </>
      )}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * StatCard - displays a KPI with icon and trend
 */
export function StatCard({ icon, label, value, trend }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="stat">
          <Icon>{icon}</Icon>
          <div>
            <div className="label">{label}</div>
            <div className="value">{value}</div>
            <div className="trend">{trend >= 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * BreakdownLegend - legend display for breakdown data
 */
export function BreakdownLegend({ items, colors }) {
  const palette =
    colors ||
    ["#2d71f7", "#4ade80", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];
  return (
    <div className="legend" role="list" aria-label="Breakdown legend">
      {items.map((it, i) => (
        <span className="legend-item" key={it.label} role="listitem">
          <span className="legend-dot" style={{ background: palette[i % palette.length] }} />
          {it.label} · {it.value}%
        </span>
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * TopPagesTable - shows top pages ranking
 */
export function TopPagesTable({ rows }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Top pages</span>
        <span className="badge">SEO</span>
      </div>
      <div className="card-body">
        <table className="table" role="table" aria-label="Top pages">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Page</th>
              <th style={{ textAlign: "right" }}>Views</th>
              <th style={{ textAlign: "right" }}>Avg. time</th>
              <th style={{ textAlign: "right" }}>Bounce</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.path}>
                <td>{r.rank}</td>
                <td>
                  <div style={{ display: "grid" }}>
                    <span>{r.path}</span>
                    <span className="row-muted">/</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>{r.views.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{r.avgTime}s</td>
                <td style={{ textAlign: "right" }}>{r.bounce}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="footer-note">Mocked data for demonstration purposes.</div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Dashboard Header with title and date range
 */
export function Header({ siteName, range, onRangeChange }) {
  return (
    <header className="header" role="banner">
      <div className="header-left">
        <div className="header-title">{siteName} Analytics</div>
        <span className="header-subtle">Light • Minimal • Realtime (mock)</span>
      </div>
      <div className="header-actions">
        <DateRangePicker range={range} onChange={onRangeChange} />
        <button className="button ghost" aria-label="Export CSV">Export</button>
        <button className="button primary" aria-label="Share dashboard">Share</button>
      </div>
    </header>
  );
}

/**
 * PUBLIC_INTERFACE
 * Sidebar component
 */
export function Sidebar() {
  return (
    <aside className="sidebar" role="navigation" aria-label="Main">
      <div className="brand">
        <div className="brand-badge" />
        <div className="brand-title">Analytics</div>
      </div>
      <div className="nav">
        <a className="active" href="#dashboard">🏠 Dashboard</a>
        <a href="#realtime">⚡ Realtime</a>
        <a href="#acquisition">📈 Acquisition</a>
        <a href="#content">🧭 Content</a>
        <a href="#settings">⚙ Settings</a>
      </div>
    </aside>
  );
}

/**
 * PUBLIC_INTERFACE
 * App is the main entry that renders the analytics dashboard.
 */
function App() {
  const config = useMemo(() => getConfig(), []);
  const [range, setRange] = useState({ preset: "7d" });

  // Mocked state
  const [series, setSeries] = useState(() => generateTimeSeries(60));
  const [devices, setDevices] = useState(() => generateDevices());
  const [browsers, setBrowsers] = useState(() => generateBrowsers());
  const [geo, setGeo] = useState(() => generateGeo());
  const [topPages, setTopPages] = useState(() => generateTopPages());

  // simulate realtime updates
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => mutateSeries(s));
      // Slightly nudge breakdowns for a dynamic feel
      setDevices((d) =>
        d.map((it) => ({ ...it, value: Math.max(1, Math.min(100, it.value + (Math.random() > 0.5 ? 1 : -1))) }))
      );
      setBrowsers((d) =>
        d.map((it) => ({ ...it, value: Math.max(1, Math.min(100, it.value + (Math.random() > 0.5 ? 1 : -1))) }))
      );
      setGeo((g) =>
        g.map((row) => ({ ...row, visitors: Math.max(1, row.visitors + (Math.random() > 0.5 ? 5 : -5)) }))
      );
      setTopPages((rows) =>
        rows.map((r) => ({ ...r, views: Math.max(0, r.views + (Math.random() > 0.5 ? 10 : -10)) }))
      );
    }, config.refreshMs);
    return () => clearInterval(id);
  }, [config.refreshMs]);

  const stats = summarize(series);
  const avgTimeOnPage = Math.round(topPages.reduce((a, b) => a + b.avgTime, 0) / topPages.length);
  const bounce = Math.round(topPages.reduce((a, b) => a + b.bounce, 0) / topPages.length);

  return (
    <div className="app">
      <Sidebar />
      <Header siteName={config.siteName} range={range} onRangeChange={setRange} />
      <main className="main">
        {/* KPI cards */}
        <section className="grid cols-4" aria-label="Key metrics">
          <StatCard icon={"👀"} label="Active visitors" value={stats.current} trend={stats.trendPct} />
          <StatCard icon={"📊"} label="Avg. per min" value={stats.avg} trend={stats.trendPct} />
          <StatCard icon={"⏱️"} label="Avg. time on page" value={`${avgTimeOnPage}s`} trend={Math.max(-5, Math.min(5, stats.trendPct))} />
          <StatCard icon={"↩️"} label="Bounce rate" value={`${bounce}%`} trend={-Math.max(-5, Math.min(5, stats.trendPct))} />
        </section>

        {/* Charts */}
        <section className="grid responsive" style={{ marginTop: 16 }}>
          <div className="card col-span-8">
            <div className="card-header">
              <span className="card-title">Traffic (real-time)</span>
              <span className="badge">Updated every {(config.refreshMs / 1000).toFixed(0)}s</span>
            </div>
            <div className="card-body">
              <LineAreaChart data={series} color="#2d71f7" />
            </div>
          </div>

          <div className="card col-span-4">
            <div className="card-header">
              <span className="card-title">Devices</span>
              <span className="badge">Live</span>
            </div>
            <div className="card-body">
              <DonutChart items={devices} />
              <div style={{ marginTop: 12 }}>
                <BreakdownLegend items={devices} />
              </div>
            </div>
          </div>

          <div className="card col-span-4">
            <div className="card-header">
              <span className="card-title">Browsers</span>
              <span className="badge">Live</span>
            </div>
            <div className="card-body">
              <DonutChart items={browsers} colors={["#0ea5e9","#22c55e","#f97316","#ef4444","#a855f7"]} />
              <div style={{ marginTop: 12 }}>
                <BreakdownLegend items={browsers} colors={["#0ea5e9","#22c55e","#f97316","#ef4444","#a855f7"]} />
              </div>
            </div>
          </div>

          <div className="card col-span-8">
            <div className="card-header">
              <span className="card-title">Geography</span>
              <span className="badge">Top regions</span>
            </div>
            <div className="card-body">
              <BarChart items={geo} color="#2d71f7" />
              <div className="footer-note">Codes represent country ISO2 (e.g., US, IN).</div>
            </div>
          </div>

          <div className="col-span-12">
            <TopPagesTable rows={topPages} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
