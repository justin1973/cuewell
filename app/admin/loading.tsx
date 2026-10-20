import "../dashboard/dashboard.css";

export default function Loading() {
  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "22px 20px" }}>
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
