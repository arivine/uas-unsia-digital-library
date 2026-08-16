export default function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <span className="stat-title">{title}</span>
      </div>
    </div>
  );
}
