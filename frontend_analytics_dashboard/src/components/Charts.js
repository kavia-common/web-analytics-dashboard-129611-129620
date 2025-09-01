/* Lightweight canvas charts (line/area, bar, donut) */
import React, { useEffect, useRef } from "react";

/**
 * Draw utilities
 */
function dprCtx(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}

function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

/**
 * PUBLIC_INTERFACE
 * LineAreaChart renders a smooth line with light area fill underneath.
 */
export function LineAreaChart({ data, color = "#2d71f7", grid = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = dprCtx(canvas);
    const { width, height } = canvas.getBoundingClientRect();
    const pad = 28;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;

    ctx.clearRect(0, 0, width, height);

    // grid
    if (grid) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 4; i++) {
        const y = pad + (innerH / 4) * i;
        ctx.moveTo(pad, y);
        ctx.lineTo(width - pad, y);
      }
      ctx.stroke();
    }

    if (!data || data.length === 0) return;
    const values = data.map((d) => d.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const xStep = innerW / Math.max(1, data.length - 1);

    const toX = (i) => pad + i * xStep;
    const toY = (v) => {
      if (max === min) return pad + innerH / 2;
      const t = (v - min) / (max - min);
      return pad + innerH - t * innerH;
    };

    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.fillStyle = color + "1A"; // area alpha

    // area
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(data[0].v));
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(toX(i), toY(data[i].v));
    }
    ctx.lineTo(toX(data.length - 1), pad + innerH);
    ctx.lineTo(toX(0), pad + innerH);
    ctx.closePath();
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(data[0].v));
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(toX(i), toY(data[i].v));
    }
    ctx.stroke();

    // x labels (min/mid/max)
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    const idxs = [0, Math.floor(data.length / 2), data.length - 1];
    idxs.forEach((i) => {
      const txt = formatTime(data[i].t);
      const tw = ctx.measureText(txt).width;
      ctx.fillText(txt, Math.min(width - pad - tw, Math.max(pad, toX(i) - tw / 2)), height - 6);
    });
  }, [data, color, grid]);

  return <canvas className="canvas" ref={ref} role="img" aria-label="Traffic over time" />;
}

/**
 * PUBLIC_INTERFACE
 * DonutChart renders a ring chart for breakdowns.
 */
export function DonutChart({ items, colors }) {
  const ref = useRef(null);
  const palette =
    colors ||
    ["#2d71f7", "#4ade80", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = dprCtx(canvas);
    const { width, height } = canvas.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - 6;
    const ir = r * 0.6;

    ctx.clearRect(0, 0, width, height);

    const total = items.reduce((a, b) => a + (b.value || 0), 0) || 1;
    let start = -Math.PI / 2;
    items.forEach((it, i) => {
      const angle = ((it.value || 0) / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.arc(cx, cy, ir, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      start += angle;
    });

    // white center to make text readable
    ctx.beginPath();
    ctx.arc(cx, cy, ir * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // label
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Breakdown", cx, cy + 4);
  }, [items, colors]);

  return <canvas className="canvas" ref={ref} role="img" aria-label="Breakdown donut chart" />;
}

/**
 * PUBLIC_INTERFACE
 * BarChart renders simple vertical bars (used for geo visualization).
 */
export function BarChart({ items, color = "#2d71f7" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = dprCtx(canvas);
    const { width, height } = canvas.getBoundingClientRect();
    const pad = 28;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    ctx.clearRect(0, 0, width, height);

    // axes
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.stroke();

    if (!items || items.length === 0) return;
    const max = Math.max(...items.map((i) => i.visitors));
    const barW = innerW / items.length - 8;
    const toH = (v) => (v / (max || 1)) * (innerH - 6);

    // bars
    items.forEach((it, idx) => {
      const x = pad + idx * (barW + 8) + 4;
      const h = toH(it.visitors);
      const y = height - pad - h;
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + "33");
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW, h);

      // label
      ctx.save();
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      const lbl = (it.code || it.country || "").toString();
      const tw = ctx.measureText(lbl).width;
      ctx.translate(x + barW / 2, height - pad + 14);
      ctx.rotate(0);
      ctx.fillText(lbl, -tw / 2, 0);
      ctx.restore();
    });
  }, [items, color]);

  return <canvas className="canvas" ref={ref} role="img" aria-label="Geography bar chart" />;
}
