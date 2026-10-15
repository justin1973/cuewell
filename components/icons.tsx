// Icone SVG inline riusabili (non dipendono da font esterni).
export function Icon({ name, className = "icn" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
    "arrow-ur": <path d="M7 17 17 7M8 7h9v9" />,
    "arrow-up": <path d="M12 19V5M6 11l6-6 6 6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    refresh: (
      <>
        <path d="M21 5v5h-5M3 19v-5h5" />
        <path d="M19.4 9A8 8 0 0 0 5.7 6.3L3 9m18 6-2.7 2.7A8 8 0 0 1 4.6 15" />
      </>
    ),
    tune: (
      <>
        <path d="M4 7h16M4 14h16" />
        <circle cx="9" cy="7" r="2.3" fill="var(--surface)" />
        <circle cx="15" cy="14" r="2.3" fill="var(--surface)" />
      </>
    ),
    funnel: <path d="M3 5h18l-7 8v6l-4 2v-8z" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </>
    ),
    msg: <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
    archive: (
      <>
        <rect x="3" y="4" width="18" height="4" rx="1" />
        <path d="M5 8v12h14V8M10 12h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      </>
    ),
    zap: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.4" />
        <path d="M3 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 5a3.4 3.4 0 0 1 0 6.6M21 21v-1a5 5 0 0 0-3-4.6" />
      </>
    ),
    activity: <path d="M22 12h-4l-3 8-6-16-3 8H2" />,
    plus: <path d="M12 5v14M5 12h14" />,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    pause: <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>,
    play: <path d="M7 4v16l13-8z" />,
    trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
    alert: <><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    download: <path d="M12 3v12m-5-5 5 5 5-5M5 21h14" />,
    card: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18" /></>,
    ban: <><circle cx="12" cy="12" r="9" /><path d="m6 6 12 12" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
