import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Sprout } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Modal, Empty, Badge } from "../../components/common/UI";
import { uid, today } from "../../services/mock";
export default function Monitoring() {
  const { db, setDb, notify, t } = useApp();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(params.has("add"));
  const [farm, setFarm] = useState(db.farms[0]?.id || "");
  const [note, setNote] = useState("");
  const [problem, setProblem] = useState(false);
  return (
    <>
      <Heading
        title={t("Crop Monitoring")}
        subtitle={t(
          "Small observations today help you make better decisions tomorrow.",
        )}
        action={
          <button className="button primary" onClick={() => setOpen(true)}>
            <Plus size={17} />
            {t("Record Observation")}
          </button>
        }
      />
      <div className="farm-grid">
        {db.farms.map((f) => (
          <div className="panel padded" key={f.id}>
            <span className="large-icon">
              <Sprout />
            </span>
            <h2>{f.name}</h2>
            <p>
              {f.crop} · {f.area} ha
            </p>
            <Badge>{f.stage}</Badge>
            <p className="muted">Planted {f.planted}</p>
            <button
              className="button secondary"
              onClick={() => {
                setFarm(f.id);
                setOpen(true);
              }}
            >
              {t("Record a field check")}
            </button>
          </div>
        ))}
      </div>
      <section className="panel padded spaced">
        <h2>{t("Observation history")}</h2>
        {!db.observations.length ? (
          <Empty text="Your next field check starts a useful history." />
        ) : (
          db.observations.map((o) => (
            <div className="list-row" key={o.id}>
              <Sprout />
              <div>
                <strong>
                  {db.farms.find((f) => f.id === o.farmId)?.name ||
                    "Removed farm"}
                </strong>
                <p>{o.note}</p>
                <small>{o.date}</small>
              </div>
              <Link to="/app/detection" className="button secondary">
                Explore assessment
              </Link>
            </div>
          ))
        )}
      </section>
      {open && (
        <Modal title={t("Record Observation")} close={() => setOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDb((d) => ({
                ...d,
                observations: [
                  { id: uid(), farmId: farm, note, date: today() },
                  ...d.observations,
                ],
                reports: problem
                  ? [
                      {
                        id: uid(),
                        farmId: farm,
                        crop: d.farms.find((f) => f.id === farm)?.crop || "",
                        issue: "Farmer-reported crop concern",
                        date: today(),
                        status: "Open",
                        note,
                      },
                      ...d.reports,
                    ]
                  : d.reports,
              }));
              setOpen(false);
              setNote("");
              notify(
                "Observation recorded" +
                  (problem ? " and shared with your officer." : "."),
              );
            }}
          >
            <label>
              {t("Farm")}
              <select
                required
                value={farm}
                onChange={(e) => setFarm(e.target.value)}
              >
                <option value="">{t("Choose a farm")}</option>
                {db.farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("What did you notice?")}
              <textarea
                required
                minLength={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leaf color, soil moisture, growth, or anything unusual…"
              />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={problem}
                onChange={(e) => setProblem(e.target.checked)}
              />
              {t("Report this concern to an extension officer")}
            </label>
            <button className="button primary">{t("Save")}</button>
          </form>
        </Modal>
      )}
    </>
  );
}
