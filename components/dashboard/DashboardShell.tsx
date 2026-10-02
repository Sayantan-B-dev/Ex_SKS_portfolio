"use client";

import { useRef, useState, type ReactNode } from "react";

export type DashboardTab = "stories" | "gallery" | "tour";

const TABS: { id: DashboardTab; label: string }[] = [
  { id: "stories", label: "STORIES" },
  { id: "gallery", label: "GALLERY" },
  { id: "tour", label: "TOUR EVENTS" },
];

/**
 * The dashboard's tab switcher. One markup, two layouts : a vertical side nav on
 * desktop and a horizontally scrollable top strip on small screens (see
 * `dashboard.css`). Only the active panel is mounted, so the forms inside never
 * duplicate their field ids in the DOM.
 */
export default function DashboardShell({
  initialTab,
  counts,
  panels,
}: {
  initialTab: DashboardTab;
  counts: Record<DashboardTab, number>;
  panels: Record<DashboardTab, ReactNode>;
}) {
  const [tab, setTab] = useState<DashboardTab>(initialTab);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /** Roving focus : arrows, Home, and End move between tabs. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = TABS.findIndex((item) => item.id === tab);
    let next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = (current + 1) % TABS.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = (current - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = TABS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    const target = TABS[next].id;
    setTab(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <div className="dashboard-body">
      <div
        className="dashboard-nav"
        role="tablist"
        aria-label="Dashboard sections"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
      >
        {TABS.map((item) => {
          const active = item.id === tab;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              id={`dashboard-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`dashboard-panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              className={`dashboard-tab ${active ? "is-active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span className="dashboard-tab-label">{item.label}</span>
              <span className="dashboard-tab-count">{counts[item.id]}</span>
            </button>
          );
        })}
      </div>

      <div
        className="dashboard-content"
        id={`dashboard-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`dashboard-tab-${tab}`}
        tabIndex={-1}
      >
        {panels[tab]}
      </div>
    </div>
  );
}
