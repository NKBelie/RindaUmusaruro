import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Calculator, CalendarDays } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading } from "../../components/common/UI";
import { uid, today } from "../../services/mock";
export default function Harvest() {
  const { db, setDb, t, notify } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [farm, setFarm] = useState(db.farms[0]?.id || "");
  const [area, setArea] = useState(db.farms[0]?.area || 1);
  const [yieldHa, setYield] = useState(3.2);
  const [actual, setActual] = useState(0);
  const [date, setDate] = useState(db.farms[0]?.harvest || today());
  const total = area * yieldHa;
  return (
    <>
      <Heading
        title={t("Harvest Planning")}
        subtitle={t("Turn your assumptions into a practical harvest plan.")}
      />
      <div className="notice green">
        <Calculator />
        <p>
          <strong>Your inputs. Your planning scenario.</strong> Estimated
          harvest = planted area (ha) × expected yield (tonnes/ha). This is a
          calculation, not a scientifically validated forecast.
        </p>
      </div>
      <div className="two-columns">
        <section className="panel padded">
          <h2>{t("Build your harvest scenario")}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const plan = {
                id: editingId || uid(),
                farmId: farm,
                area,
                yield: yieldHa,
                actual,
                date,
              };
              setDb((d) => ({
                ...d,
                harvests: editingId
                  ? d.harvests.map((h) => (h.id === editingId ? plan : h))
                  : [plan, ...d.harvests],
              }));
              setEditingId(null);
              notify("Harvest plan saved");
            }}
          >
            <label>
              {t("Farm & crop")}
              <select
                required
                value={farm}
                onChange={(e) => {
                  const f = db.farms.find((f) => f.id === e.target.value);
                  setFarm(e.target.value);
                  if (f) {
                    setArea(f.area);
                    setDate(f.harvest || today());
                  }
                }}
              >
                <option value="">{t("Choose a farm")}</option>
                {db.farms.map((f) => (
                  <option value={f.id} key={f.id}>
                    {f.name} · {f.crop}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                {t("Planted area (ha)")}
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                />
              </label>
              <label>
                {t("Expected yield (tonnes/ha)")}
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.1"
                  value={yieldHa}
                  onChange={(e) => setYield(Number(e.target.value))}
                />
              </label>
              <label>
                {t("Expected harvest date")}
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                {t("Actual harvest (tonnes)")}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={actual}
                  onChange={(e) => setActual(Number(e.target.value))}
                />
              </label>
            </div>
            <button className="button primary wide">
              {t("Save harvest plan")}
            </button>
          </form>
        </section>
        <section className="harvest-result">
          <span className="eyebrow">A LITTLE PLANNING GOES A LONG WAY</span>
          <h2>{t("Your estimated harvest")}</h2>
          <strong>
            {total.toFixed(2)}
            <small>tonnes</small>
          </strong>
          <p>
            {area} ha × {yieldHa} tonnes/ha
          </p>
          <div className="result-rule" />
          <p>
            Actual harvest: <b>{actual.toFixed(2)} tonnes</b>
          </p>
          <p>
            {actual > 0 && total > 0
              ? `${(((actual - total) / total) * 100).toFixed(1)}% compared with your scenario`
              : "Record your actual harvest to compare results."}
          </p>
          <span>
            <CalendarDays size={17} /> {date || "Choose a harvest date"}
          </span>
        </section>
      </div>
      <section className="panel padded spaced">
        <h2>{t("Production history")}</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={db.harvests.map((h) => ({
              name:
                db.farms.find((f) => f.id === h.farmId)?.name || "Removed farm",
              Estimated: Number((h.area * h.yield).toFixed(2)),
              Actual: h.actual,
            }))}
          >
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis unit=" t" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Estimated" fill="#8cb99b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" fill="#205c3b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("Farm")}</th>
                <th>Date</th>
                <th>Area</th>
                <th>Estimated</th>
                <th>Actual</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {db.harvests.map((h) => (
                <tr key={h.id}>
                  <td>{db.farms.find((f) => f.id === h.farmId)?.name}</td>
                  <td>{h.date}</td>
                  <td>{h.area} ha</td>
                  <td>{(h.area * h.yield).toFixed(2)} t</td>
                  <td>{h.actual || "Not recorded"}</td>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => {
                        setFarm(h.farmId);
                        setArea(h.area);
                        setYield(h.yield);
                        setDate(h.date);
                        setActual(h.actual);
                        setEditingId(h.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        notify("Plan loaded for editing. Save when complete.");
                      }}
                    >
                      Edit plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
