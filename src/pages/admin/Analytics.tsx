import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useApp } from "../../contexts/AppContext";
import { Heading, Badge } from "../../components/common/UI";
export default function Analytics() {
  const { db, t } = useApp();
  const districts = [...new Set(db.farms.map((f) => f.district))].map(
    (name) => ({
      name,
      farms: db.farms.filter((f) => f.district === name).length,
    }),
  );
  const crops = [...new Set(db.farms.map((f) => f.crop))].map((name) => ({
    name,
    value: db.farms.filter((f) => f.crop === name).length,
  }));
  return (
    <>
      <Heading
        title={t("Analytics")}
        subtitle="A view of the prototype’s local data, never national agricultural statistics."
        action={<Badge>Fictional demo records</Badge>}
      />
      <div className="stats-grid">
        {[
          ["Farmers", db.users.filter((u) => u.role === "farmer").length],
          [
            "Extension officers",
            db.users.filter((u) => u.role === "officer").length,
          ],
          ["Crop reports", db.reports.length],
          ["Harvest records", db.harvests.length],
        ].map(([label, n]) => (
          <div className="stat-card" key={label}>
            <p>{label}</p>
            <strong className="stat-number">{n}</strong>
          </div>
        ))}
      </div>
      <div className="two-columns spaced">
        <section className="panel padded">
          <h2>Farms by district</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={districts}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="farms" fill="#43825a" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="panel padded">
          <h2>Crop distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={crops}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                label={({ name }) => name}
              >
                {crops.map((c, i) => (
                  <Cell
                    key={c.name}
                    fill={["#285e40", "#83af87", "#dfbc62", "#678a96"][i % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>
      <section className="panel padded spaced">
        <h2>Local platform activity</h2>
        <div className="list-row">
          <strong>{db.observations.length}</strong>
          <span>Field observations recorded</span>
        </div>
        <div className="list-row">
          <strong>
            {db.reports.filter((r) => r.status === "Resolved").length}
          </strong>
          <span>Crop reports resolved</span>
        </div>
        <div className="list-row">
          <strong>{db.visits.length}</strong>
          <span>Field visits scheduled</span>
        </div>
        <p className="muted">
          Counts reflect browser-local demo records. Historical activity is not
          inferred.
        </p>
      </section>
    </>
  );
}
