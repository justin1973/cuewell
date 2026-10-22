import Link from "next/link";
import { Icon } from "@/components/icons";

function timeAgo(iso: string | null): string {
  if (!iso) return "scanning soon";
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return h === 1 ? "1 hour ago" : `${h} hours ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

// A faded placeholder that shows what a real lead will look like.
function GhostLead({ score, band }: { score: number; band: string }) {
  return (
    <div className="ghost">
      <div className="ghost-top">
        <div className="ghost-chips"><span /><span /></div>
        <div className={`ghost-score ${band}`}>{score}</div>
      </div>
      <div className="ghost-line w80" />
      <div className="ghost-line w95" />
      <div className="ghost-line w60" />
    </div>
  );
}

export function EmptyFeed({ nicheCount, lastChecked }: { nicheCount: number; lastChecked: string | null }) {
  if (nicheCount === 0) {
    return (
      <div className="estate">
        <div className="estate-badge"><Icon name="tune" /></div>
        <h3>Set up your first niche</h3>
        <p>Tell Cuewell what you sell and which words to watch. The moment it&apos;s saved, the engine starts scanning for people actively looking to buy.</p>
        <Link className="btn btn-primary sm" href="/dashboard/setup"><Icon name="plus" />Create a niche</Link>
      </div>
    );
  }

  return (
    <>
      <div className="estate">
        <div className="estate-badge pulse"><Icon name="activity" /></div>
        <h3>Cuewell is on watch</h3>
        <p>
          Monitoring {nicheCount} {nicheCount === 1 ? "niche" : "niches"} across Hacker News, Lobsters, Stack Exchange, Dev.to and Bluesky.
          Last checked {timeAgo(lastChecked)}.
        </p>
        <div className="estate-steps">
          <div className="estep"><span className="en">1</span>Scan every hour</div>
          <div className="estep-sep" />
          <div className="estep"><span className="en">2</span>AI scores buying intent</div>
          <div className="estep-sep" />
          <div className="estep"><span className="en">3</span>Hot leads land here</div>
        </div>
        <Link className="btn btn-ghost sm" href="/dashboard/setup"><Icon name="tune" />Refine your niches</Link>
      </div>

      <div className="ghost-label">What your leads will look like</div>
      <GhostLead score={9} band="hot" />
      <GhostLead score={7} band="warm" />
    </>
  );
}
