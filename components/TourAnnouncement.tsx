"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TourSlide = {
  id: string;
  kicker: string;
  title: string;
  dateText: string;
  description: string;
  image: string;
  startingPoint: string;
  cities: string[];
  endingText: string;
  redirectTo: string;
  ctaLabel: string;
};

/* ── Journey map geometry, in SVG user units ──
 * Authored, never measured : the same numbers give the same road on the server
 * and the client, and the node buttons are positioned from the same constants as
 * percentages, so the dots always sit exactly on the road. */
const MAP_W = 1000;
const MAP_H = 240;
const MAP_PAD_X = 56;
const MAP_WAVES = 3;
/** The journey never stops : it travels to the next stop, holds, travels again. */
const MOVE_MS = 500;
const HOLD_MS = 500;
/** Resolution used to place waypoints on the curve and to scrub by cursor. */
const SAMPLES = 480;

type Point = { x: number; y: number };

/** Evenly spaced waypoints that wave up and down across the map's width. */
function buildLayout(count: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const x = MAP_PAD_X + t * (MAP_W - MAP_PAD_X * 2);
    const y = MAP_H / 2 + Math.sin(t * Math.PI * MAP_WAVES) * (MAP_H / 2 - 62);
    points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  }
  return points;
}

/** A Catmull-Rom spline through the waypoints, as a cubic Bézier path. */
function buildPath(points: Point[]) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${
      p2.x - (p3.x - p1.x) / 6
    } ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * The dynamic tour announcement that sits between the hero and the stats bar.
 *
 * Wide screens lay it out as one row : [info][image][map], all three the same
 * height. The image keeps the uploaded file's own aspect ratio, and the map is a
 * low, wide journey road whose trail lights up behind a travelling avatar. The
 * journey loops forever, one stop at a time (0.5s travel, 0.5s hold), naming each
 * city as it arrives. The cursor can scrub the traveller, and milestones pin it.
 * Small screens stack the three into a single column.
 */
export default function TourAnnouncement({ events }: { events: TourSlide[] }) {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const avatarRef = useRef<HTMLSpanElement>(null);
  const fractionsRef = useRef<number[]>([]);
  const samplesRef = useRef<Point[]>([]);
  const progressRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const lastIndexRef = useRef(0);
  /** Which stop the loop is heading for, and where it is in that step. */
  const stopRef = useRef(0);
  const phaseRef = useRef<"travel" | "hold">("hold");
  const phaseStartRef = useRef(0);
  const fromRef = useRef(0);
  /** Set by the pointer handlers so the frame loop stamps the hold time itself. */
  const pendingHoldRef = useRef(false);

  const safeIndex = Math.min(index, Math.max(events.length - 1, 0));
  const event = events[safeIndex];
  const navigable = events.length > 1;

  const nodes = useMemo(
    () => (event ? [event.startingPoint, ...event.cities].filter(Boolean) : []),
    [event]
  );
  const layout = useMemo(() => buildLayout(nodes.length), [nodes.length]);
  const road = useMemo(() => buildPath(layout), [layout]);

  /** Writes the trail's dash offset and the avatar's position, straight to the DOM. */
  const paint = useCallback((progress: number) => {
    const path = pathRef.current;
    const trail = trailRef.current;
    const avatar = avatarRef.current;
    if (!path || !trail || !avatar) return;
    trail.style.strokeDashoffset = String(1 - progress);
    let total = 0;
    try {
      total = path.getTotalLength();
    } catch {
      total = 0;
    }
    if (total <= 0) return;
    const at = path.getPointAtLength(total * progress);
    avatar.style.left = `${(at.x / MAP_W) * 100}%`;
    avatar.style.top = `${(at.y / MAP_H) * 100}%`;
  }, []);

  /**
   * Places each waypoint on the drawn curve, resets the run for the current
   * event, then drives the traveller : the cursor scrubs it, and it otherwise
   * moves stop by stop, forever. Reduced motion steps straight to the finish.
   */
  useEffect(() => {
    const path = pathRef.current;
    if (!path || nodes.length === 0) return;

    let total = 0;
    try {
      total = path.getTotalLength();
    } catch {
      total = 0;
    }

    const fractions: number[] = [];
    if (total > 0) {
      const pts: Point[] = [];
      for (let i = 0; i < SAMPLES; i += 1) {
        const at = path.getPointAtLength((i / (SAMPLES - 1)) * total);
        pts.push({ x: at.x, y: at.y });
      }
      samplesRef.current = pts;
      for (const waypoint of layout) {
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < pts.length; i += 1) {
          const dx = pts[i].x - waypoint.x;
          const dy = pts[i].y - waypoint.y;
          const dist = dx * dx + dy * dy;
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        }
        fractions.push(best / (SAMPLES - 1));
      }
    } else {
      samplesRef.current = [];
      layout.forEach(() => fractions.push(0));
    }
    fractionsRef.current = fractions;

    progressRef.current = 0;
    lastIndexRef.current = 0;
    stopRef.current = 0;
    phaseRef.current = "hold";
    phaseStartRef.current = performance.now();
    setActive(0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || total <= 0) {
      progressRef.current = 1;
      const last = Math.max(nodes.length - 1, 0);
      lastIndexRef.current = last;
      setActive(last);
      // Let the browser paint the new geometry before moving the avatar onto it.
      requestAnimationFrame(() => paint(1));
      return;
    }

    paint(0);

    let raf = 0;
    const tick = (now: number) => {
      if (pendingHoldRef.current) {
        pendingHoldRef.current = false;
        phaseStartRef.current = now;
      }
      if (hoveringRef.current && targetRef.current !== null) {
        // Scrubbing : ease onto the cursor, and re-enter the loop from there.
        progressRef.current += (targetRef.current - progressRef.current) * 0.18;
      } else if (phaseRef.current === "hold") {
        if (now - phaseStartRef.current >= HOLD_MS) {
          const last = fractions.length - 1;
          if (stopRef.current >= last) {
            // Restart the journey from the first stop.
            progressRef.current = 0;
            stopRef.current = 0;
            phaseStartRef.current = now;
            paint(0);
          } else {
            stopRef.current += 1;
            fromRef.current = progressRef.current;
            phaseRef.current = "travel";
            phaseStartRef.current = now;
          }
        }
      } else {
        const t = Math.min((now - phaseStartRef.current) / MOVE_MS, 1);
        const eased = 1 - (1 - t) ** 3;
        const goal = fractions[stopRef.current] ?? 1;
        progressRef.current = fromRef.current + (goal - fromRef.current) * eased;
        if (t >= 1) {
          phaseRef.current = "hold";
          phaseStartRef.current = now;
        }
      }

      const progress = Math.min(Math.max(progressRef.current, 0), 1);
      paint(progress);

      let current = 0;
      for (let i = 0; i < fractions.length; i += 1) {
        if (progress >= fractions[i] - 0.004) current = i;
      }
      if (current !== lastIndexRef.current) {
        lastIndexRef.current = current;
        setActive(current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [layout, nodes.length, paint]);

  /** Jumps the traveller to one stop and holds there before looping on. */
  const jumpTo = (nodeIndex: number) => {
    const fraction = fractionsRef.current[nodeIndex] ?? 0;
    progressRef.current = fraction;
    paint(fraction);
    lastIndexRef.current = nodeIndex;
    stopRef.current = nodeIndex;
    phaseRef.current = "hold";
    pendingHoldRef.current = true;
    setActive(nodeIndex);
  };

  /** Scrub : the cursor's x position maps onto the road's x position. */
  const handleMove = (mouseEvent: React.MouseEvent<HTMLDivElement>) => {
    const rect = mouseEvent.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((mouseEvent.clientX - rect.left) / rect.width, 0),
      1
    );
    hoveringRef.current = true;
    if (!scrubbing) setScrubbing(true);

    const pts = samplesRef.current;
    if (pts.length === 0) {
      targetRef.current = ratio;
      return;
    }
    const targetX = ratio * MAP_W;
    let lo = 0;
    let hi = pts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (pts[mid].x < targetX) lo = mid + 1;
      else hi = mid;
    }
    const chosen =
      lo > 0 && Math.abs(pts[lo - 1].x - targetX) < Math.abs(pts[lo].x - targetX)
        ? lo - 1
        : lo;
    targetRef.current = chosen / (pts.length - 1);
  };

  /** Hands the journey back to the loop, resuming from the nearest stop. */
  const handleLeave = () => {
    hoveringRef.current = false;
    targetRef.current = null;
    setScrubbing(false);
    const progress = progressRef.current;
    const fractions = fractionsRef.current;
    let nearest = 0;
    for (let i = 0; i < fractions.length; i += 1) {
      if (progress >= fractions[i] - 0.004) nearest = i;
    }
    stopRef.current = nearest;
    phaseRef.current = "hold";
    pendingHoldRef.current = true;
  };

  if (!event || events.length === 0) return null;

  const linkIsInternal = event.redirectTo.startsWith("/");
  const ctaLabel = event.ctaLabel || "EXPLORE THE TOUR";
  const start = layout[0];
  const avatarStart = start
    ? { left: `${(start.x / MAP_W) * 100}%`, top: `${(start.y / MAP_H) * 100}%` }
    : undefined;

  return (
    <section className="tour" aria-label="Tour announcement">
      <div className="tour-inner reveal-up">
        {navigable && (
          <div className="tour-switcher">
            <div className="tour-switcher-meta">
              <span className="tour-switcher-label">TOUR DATES</span>
              <span className="tour-switcher-count">
                {String(safeIndex + 1).padStart(2, "0")} /{" "}
                {String(events.length).padStart(2, "0")}
              </span>
            </div>
            <div className="tour-dots">
              {events.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  className={`tour-dot ${dotIndex === safeIndex ? "is-active" : ""}`}
                  aria-label={`Show ${item.title}`}
                  aria-current={dotIndex === safeIndex}
                  onClick={() => setIndex(dotIndex)}
                />
              ))}
            </div>
          </div>
        )}

        <div
          className={`tour-body ${nodes.length === 0 ? "is-short" : ""}`}
          aria-live="polite"
        >
          <div className="tour-col-info">
            {event.kicker && <p className="tour-kicker">{event.kicker}</p>}
            <h2 className="tour-title">{event.title}</h2>
            {event.dateText && <p className="tour-date">{event.dateText}</p>}
            <p className="tour-desc">{event.description}</p>
            {event.redirectTo && (
              <div className="tour-cta-row">
                {linkIsInternal ? (
                  <Link href={event.redirectTo} className="btn-outline-pink tour-cta">
                    {ctaLabel} <span className="btn-arrow">↗</span>
                  </Link>
                ) : (
                  <a
                    href={event.redirectTo}
                    className="btn-outline-pink tour-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ctaLabel} <span className="btn-arrow">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {event.image && (
            <figure className="tour-col-media">
              {/* eslint-disable-next-line @next/next/no-img-element -- the image can be a link the author pasted from any host, and keeps its own aspect ratio */}
              <img src={event.image} alt={event.title} loading="lazy" />
            </figure>
          )}

          {nodes.length > 0 && (
            <div className="tour-col-map">
              <div className="tour-map">
                <div className="tour-map-head">
                  <span className="tour-journey-label">THE JOURNEY</span>
                  <span className="tour-map-count">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(nodes.length).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className="tour-map-canvas"
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                >
                  <svg
                    className="tour-map-svg"
                    viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path ref={pathRef} className="tour-map-road" d={road} />
                    <path
                      ref={trailRef}
                      className="tour-map-trail"
                      d={road}
                      pathLength={1}
                      strokeDasharray="1"
                      strokeDashoffset="1"
                    />
                  </svg>

                  {layout.map((point, nodeIndex) => (
                    <button
                      key={`${nodes[nodeIndex]}-${nodeIndex}`}
                      type="button"
                      className={`tour-map-node ${
                        nodeIndex <= active ? "is-lit" : ""
                      } ${nodeIndex === active ? "is-active" : ""} ${
                        nodeIndex === 0 ? "is-start" : ""
                      } ${nodeIndex === 0 ? "is-first" : ""} ${
                        nodeIndex === layout.length - 1 ? "is-last" : ""
                      } ${nodeIndex % 2 === 0 ? "is-above" : "is-below"}`}
                      style={{
                        left: `${(point.x / MAP_W) * 100}%`,
                        top: `${(point.y / MAP_H) * 100}%`,
                      }}
                      onClick={() => jumpTo(nodeIndex)}
                      onFocus={() => jumpTo(nodeIndex)}
                      aria-label={
                        nodeIndex === 0
                          ? `Start of the journey: ${nodes[nodeIndex]}`
                          : `Stop ${nodeIndex + 1}: ${nodes[nodeIndex]}`
                      }
                      aria-current={nodeIndex === active}
                    >
                      <span className="tour-map-node-dot" aria-hidden="true" />
                      <span className="tour-map-node-label" aria-hidden="true">
                        {nodes[nodeIndex]}
                      </span>
                    </button>
                  ))}

                  <span
                    ref={avatarRef}
                    className="tour-map-avatar"
                    style={avatarStart}
                    aria-hidden="true"
                  />
                </div>

                <div className="tour-map-readout">
                  <span className="tour-map-stop">
                    {active === 0 ? "START" : `STOP ${String(active + 1).padStart(2, "0")}`}
                  </span>
                  <strong className="tour-map-city">{nodes[active] ?? ""}</strong>
                  <span className="tour-map-hint">
                    {scrubbing
                      ? "SWEEP TO TRAVEL THE ROUTE"
                      : "MOVE YOUR CURSOR ACROSS THE MAP"}
                  </span>
                </div>

                {event.endingText && (
                  <p className="tour-ending">{event.endingText}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
