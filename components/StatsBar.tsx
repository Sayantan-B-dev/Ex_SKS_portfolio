const STATS = [
  {
    label: "COUNTRIES",
    num: "40+",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M2.5 12h19M12 2.5c2.6 2.6 4 6 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-6-4-9.5s1.4-6.9 4-9.5z" />
      </svg>
    ),
  },
  {
    label: "SHOWS",
    num: "1300+",
    icon: (
      <svg width="22" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v4M9 22h6" />
      </svg>
    ),
  },
  {
    label: "OF FANS",
    num: "MILLIONS",
    icon: (
      <svg width="28" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="8" r="3.2" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6M15.5 15c2.6.2 4.5 2.2 4.5 5" />
      </svg>
    ),
  },
  {
    label: "WINNING ARTIST",
    num: "AWARD",
    icon: (
      <svg width="24" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3h12v4a6 6 0 0 1-12 0V3z" />
        <path d="M6 5H3a3 3 0 0 0 3 5M18 5h3a3 3 0 0 1-3 5" />
        <path d="M12 13v4M8.5 21h7l-1-3.5h-5L8.5 21z" />
      </svg>
    ),
  },
];

export default function StatsBar() {
  return (
    <section className="stats">
      <div className="stats-inner wrap reveal-stagger">
        {STATS.map((s, idx) => (
          <div
            className="stat reveal-item"
            key={s.label}
            style={{ "--i": idx } as React.CSSProperties}
          >
            <span aria-hidden="true">{s.icon}</span>
            <div>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
