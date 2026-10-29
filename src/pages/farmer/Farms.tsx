import { lazy, Suspense, useState } from "react";
const FarmMap = lazy(() => import("../../components/common/FarmMap"));
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  MapPin,
  Pencil,
  Trash2,
  Sprout,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Modal, Badge, Empty } from "../../components/common/UI";
import { crops, locations, photos } from "../../data/demo";
import { uid, today } from "../../services/mock";
import type { Farm } from "../../types";
const blank: Farm = {
  id: "",
  name: "",
  crop: "Maize",
  area: 1,
  province: "Eastern",
  district: "Rwamagana",
  sector: "Muhazi",
  village: "",
  planted: today(),
  harvest: "",
  soil: "Loam",
  irrigation: "Rain-fed",
  gps: "",
  stage: "Seedling",
  image: photos.field,
};
export default function Farms() {
  const { db, setDb, t, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<Farm | null>(
    params.has("add") ? blank : null,
  );
  const [view, setView] = useState(params.get("view"));
  const [search, setSearch] = useState(params.get("q") || "");
  const [crop, setCrop] = useState("All crops");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [map, setMap] = useState(false);
  const close = () => {
    setEditing(null);
    setParams({});
  };
  const update = (key: keyof Farm, value: string | number) =>
    setEditing((f) => (f ? { ...f, [key]: value } : f));
  const filtered = db.farms.filter(
    (f) =>
      (f.name + " " + f.district)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (crop === "All crops" || f.crop === crop),
  );
  return (
    <>
      <Heading
        eyebrow="YOUR LAND, YOUR POTENTIAL"
        title={t("My Farms")}
        subtitle={t("Every field has a story. Keep yours growing.")}
        action={
          <button
            className="button primary"
            onClick={() => setEditing({ ...blank })}
          >
            <Plus size={17} />
            {t("Add Farm")}
          </button>
        }
      />
      <div className="panel toolbar">
        <label className="search-input">
          <Search size={18} />
          <input
            aria-label="Search farms"
            placeholder={t("Search farms or districts…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter crop"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        >
          {["All crops", ...crops].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="button secondary" onClick={() => setMap(!map)}>
          <MapPin size={16} />
          {map ? "Card view" : "Location view"}
        </button>
      </div>
      {map ? (
        <div className="panel">
          <h2>Sample farm locations</h2>
          <Suspense
            fallback={<div className="skeleton" aria-label="Loading map" />}
          >
            <FarmMap farms={filtered} />
          </Suspense>
          <p className="muted">
            District-level demonstration locations. GPS coordinates are
            optional.
          </p>
          {filtered.map((f) => (
            <div className="list-row" key={f.id}>
              <MapPin />
              <div>
                <strong>{f.name}</strong>
                <p>
                  {f.province} / {f.district} / {f.sector}
                </p>
              </div>
              <button
                className="button secondary"
                onClick={() => setView(f.id)}
              >
                View details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="farm-grid">
          {filtered.map((f) => (
            <article className="panel farm-card" key={f.id}>
              <div className="farm-card-photo">
                <img
                  src={f.image}
                  alt={"Illustrative " + f.crop + " farm"}
                  loading="lazy"
                />
                <Badge>{f.stage}</Badge>
              </div>
              <div className="farm-card-content">
                <div className="row between">
                  <h2>{f.name}</h2>
                  <button
                    className="icon-button"
                    aria-label={"View " + f.name}
                    onClick={() => setView(f.id)}
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
                <p className="muted">
                  <MapPin size={14} /> {f.district}, {f.province}
                </p>
                <div className="farm-facts">
                  <span>
                    <Sprout size={17} />
                    {f.crop}
                  </span>
                  <strong>{f.area} hectares</strong>
                </div>
                <p className="muted">
                  Planted {f.planted} · Harvest {f.harvest || "Unplanned"}
                </p>
                <div className="row">
                  <button
                    className="button secondary"
                    onClick={() => setEditing({ ...f })}
                  >
                    <Pencil size={15} />
                    {t("Edit farm")}
                  </button>
                  <button
                    className="icon-button danger"
                    aria-label={"Delete " + f.name}
                    onClick={() => setDeleting(f.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {!filtered.length && (
        <Empty text="No farms found">
          <button
            className="button primary"
            onClick={() => setEditing({ ...blank })}
          >
            Add your first farm
          </button>
        </Empty>
      )}
      {editing && (
        <Modal title={editing.id ? "Edit farm" : t("Add Farm")} close={close}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editing.harvest && editing.harvest < editing.planted) {
                notify("Harvest date must be after planting.");
                return;
              }
              const farm = {
                ...editing,
                id: editing.id || uid(),
                image:
                  editing.crop === "Maize"
                    ? photos.maize
                    : editing.crop === "Potatoes"
                      ? photos.potatoes
                      : photos.field,
              };
              setDb((d) => ({
                ...d,
                farms: editing.id
                  ? d.farms.map((f) => (f.id === editing.id ? farm : f))
                  : [...d.farms, farm],
              }));
              notify("Farm saved successfully");
              close();
            }}
          >
            <div className="form-grid">
              <label className="full">
                {t("Farm name")}
                <input
                  required
                  autoFocus
                  value={editing.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Muhazi Hillside"
                />
              </label>
              <label>
                {t("Crop type")}
                <select
                  value={editing.crop}
                  onChange={(e) => update("crop", e.target.value)}
                >
                  {crops.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                {t("Area (ha)")}
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max="100000"
                  required
                  value={editing.area}
                  onChange={(e) => update("area", Number(e.target.value))}
                />
              </label>
              <label>
                {t("Province")}
                <select
                  value={editing.province}
                  onChange={(e) => {
                    const p = e.target.value;
                    const d = Object.keys(locations[p])[0];
                    setEditing({
                      ...editing,
                      province: p,
                      district: d,
                      sector: locations[p][d][0],
                    });
                  }}
                >
                  {Object.keys(locations).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                {t("District")}
                <select
                  value={editing.district}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      district: e.target.value,
                      sector: locations[editing.province][e.target.value][0],
                    })
                  }
                >
                  {Object.keys(locations[editing.province]).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                {t("Sector")}
                <select
                  value={editing.sector}
                  onChange={(e) => update("sector", e.target.value)}
                >
                  {locations[editing.province][editing.district].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                {t("Village")}
                <input
                  required
                  value={editing.village}
                  onChange={(e) => update("village", e.target.value)}
                />
              </label>
              <p className="form-hint full">
                Sample location choices for the prototype; not a complete
                administrative directory.
              </p>
              <label>
                {t("Planting date")}
                <input
                  type="date"
                  required
                  value={editing.planted}
                  onChange={(e) => update("planted", e.target.value)}
                />
              </label>
              <label>
                {t("Harvest date")}
                <input
                  type="date"
                  min={editing.planted}
                  value={editing.harvest}
                  onChange={(e) => update("harvest", e.target.value)}
                />
              </label>
              <label>
                {t("Soil type")}
                <select
                  value={editing.soil}
                  onChange={(e) => update("soil", e.target.value)}
                >
                  {["Loam", "Clay loam", "Sandy", "Volcanic"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                {t("Irrigation method")}
                <select
                  value={editing.irrigation}
                  onChange={(e) => update("irrigation", e.target.value)}
                >
                  {["Rain-fed", "Drip", "Sprinkler", "Manual"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                {t("Growth stage")}
                <select
                  value={editing.stage}
                  onChange={(e) => update("stage", e.target.value)}
                >
                  {[
                    "Seedling",
                    "Vegetative",
                    "Flowering",
                    "Tuber formation",
                    "Maturing",
                    "Harvest ready",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                GPS coordinates (optional)
                <input
                  value={editing.gps}
                  onChange={(e) => update("gps", e.target.value)}
                  placeholder="Latitude, longitude"
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={close}
              >
                {t("Cancel")}
              </button>
              <button className="button primary">{t("Save")}</button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete this farm?" close={() => setDeleting(null)}>
          <p>
            This also removes its observations and harvest plans. Reports remain
            in your history.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setDeleting(null)}
            >
              {t("Keep farm")}
            </button>
            <button
              className="button danger-button"
              onClick={() => {
                setDb((d) => ({
                  ...d,
                  farms: d.farms.filter((f) => f.id !== deleting),
                  observations: d.observations.filter(
                    (o) => o.farmId !== deleting,
                  ),
                  harvests: d.harvests.filter((h) => h.farmId !== deleting),
                }));
                setDeleting(null);
                notify("Farm deleted");
              }}
            >
              {t("Delete farm")}
            </button>
          </div>
        </Modal>
      )}
      {view && db.farms.find((f) => f.id === view) && (
        <Modal
          title={db.farms.find((f) => f.id === view)!.name}
          close={() => setView(null)}
        >
          {Object.entries(db.farms.find((f) => f.id === view)!)
            .filter(([k]) => !["id", "image"].includes(k))
            .map(([k, v]) => (
              <div className="detail-row" key={k}>
                <span>{k}</span>
                <strong>{v || "Not set"}</strong>
              </div>
            ))}
          <h3>Activity history</h3>
          {db.observations
            .filter((o) => o.farmId === view)
            .map((o) => (
              <p key={o.id}>
                {o.date} — {o.note}
              </p>
            ))}
          <p className="muted">
            Farm registration and crop observations appear here.
          </p>
        </Modal>
      )}
    </>
  );
}
