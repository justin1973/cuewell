// Shown instantly while a dashboard page loads — so a click never looks frozen.
export default function Loading() {
  return (
    <div>
      <div className="loadbar"><span /></div>
      <div className="sk sk-title" />
      <div className="sk sk-sub" />
      <div className="sk-tiles">
        <div className="sk sk-tile" /><div className="sk sk-tile" /><div className="sk sk-tile" /><div className="sk sk-tile" />
      </div>
      <div className="sk sk-card" />
      <div className="sk sk-card" />
    </div>
  );
}
