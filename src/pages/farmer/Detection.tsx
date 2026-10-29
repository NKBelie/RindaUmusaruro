import { useState } from "react";
import {
  ScanLine,
  Upload,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Badge } from "../../components/common/UI";
import { crops } from "../../data/demo";
import { scenarios, today, uid } from "../../services/mock";
export default function Detection() {
  const { db, setDb, t, notify } = useApp();
  const [farm, setFarm] = useState(db.farms[0]?.id || "");
  const [crop, setCrop] = useState(db.farms[0]?.crop || "Maize");
  const [scenario, setScenario] = useState("Leaf discoloration");
  const [image, setImage] = useState("");
  const [result, setResult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <Heading
        eyebrow="OBSERVE. UNDERSTAND. TAKE ACTION."
        title={t("Disease Detection")}
        subtitle={t(
          "A helpful starting point for a conversation with your extension officer.",
        )}
      />
      <div className="notice amber">
        <ShieldCheck size={22} />
        <div>
          <strong>Demo Assessment – Not an AI Diagnosis</strong>
          <p>
            This prototype uses a scenario you select. It does not analyze your
            image or predict crop disease.
          </p>
        </div>
      </div>
      <div className="two-columns">
        <section className="panel padded">
          <h2>Let’s take a closer look</h2>
          <p className="muted">Choose your field and add a clear crop photo.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setBusy(true);
              setResult(false);
              setSaved(false);
              setTimeout(() => {
                setBusy(false);
                setResult(true);
              }, 1000);
            }}
          >
            <label>
              {t("Registered farm")}
              <select
                required
                value={farm}
                onChange={(e) => {
                  setFarm(e.target.value);
                  setCrop(
                    db.farms.find((f) => f.id === e.target.value)?.crop ||
                      "Maize",
                  );
                  setResult(false);
                }}
              >
                <option value="">{t("Select a farm")}</option>
                {db.farms.map((f) => (
                  <option value={f.id} key={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("Crop type")}
              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value);
                  setResult(false);
                }}
              >
                {crops.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              {t("Demonstration scenario")}
              <select
                value={scenario}
                onChange={(e) => {
                  setScenario(e.target.value);
                  setResult(false);
                }}
              >
                {Object.keys(scenarios).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="upload-zone">
              {image ? (
                <img src={image} alt="Your uploaded crop" />
              ) : (
                <>
                  <span className="large-icon">
                    <Upload />
                  </span>
                  <strong>{t("Upload a crop photo")}</strong>
                  <span>{t("Choose an image or take a photo")}</span>
                  <small>JPG, PNG, WebP · Up to 2 MB</small>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!image}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (
                    file.size > 2 * 1024 * 1024 ||
                    !["image/jpeg", "image/png", "image/webp"].includes(
                      file.type,
                    )
                  ) {
                    setError(
                      "Choose a JPG, PNG, or WebP image smaller than 2 MB.",
                    );
                    return;
                  }
                  setError("");
                  setResult(false);
                  const reader = new FileReader();
                  reader.onload = () => setImage(String(reader.result));
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button
              disabled={busy || !farm || !image}
              className="button primary wide"
            >
              <ScanLine size={18} />
              {busy ? "Preparing demo assessment…" : t("Analyze Crop")}
            </button>
          </form>
        </section>
        <section className="panel padded">
          {busy ? (
            <div className="skeleton-group" aria-busy="true">
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
              <p>Loading the selected demo scenario…</p>
            </div>
          ) : result ? (
            <>
              <Badge tone="amber">Demo Assessment – Not an AI Diagnosis</Badge>
              <h2 className="result-title">{scenarios[scenario].issue}</h2>
              <p className="muted">
                {crop} · {today()} · Preconfigured scenario
              </p>
              <h3>{t("Example symptoms")}</h3>
              <p>{scenarios[scenario].symptoms}</p>
              <h3>{t("Practical next steps")}</h3>
              <p>{scenarios[scenario].steps}</p>
              <div className="notice green">
                <ShieldCheck />
                <p>
                  Consult an agricultural extension officer for a field
                  assessment. No model confidence is available.
                </p>
              </div>
              <button
                disabled={saved}
                className="button primary wide"
                onClick={() => {
                  setDb((d) => ({
                    ...d,
                    reports: [
                      {
                        id: uid(),
                        farmId: farm,
                        crop,
                        issue: scenarios[scenario].issue,
                        date: today(),
                        status: "Open",
                        note: `Demo scenario: ${scenario}. ${scenarios[scenario].symptoms}`,
                        image,
                      },
                      ...d.reports,
                    ],
                  }));
                  setSaved(true);
                  notify("Report saved and sent to the extension officer.");
                }}
              >
                {saved ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
                {saved
                  ? "Saved & sent for review"
                  : t("Send to extension officer")}
              </button>
            </>
          ) : (
            <div className="assessment-empty">
              <span className="assessment-illustration">
                <ScanLine size={70} strokeWidth={1} />
              </span>
              <h2>A clearer picture starts here.</h2>
              <p>
                Your demonstration assessment will appear here after you select
                a scenario and upload a photo.
              </p>
              <div className="assessment-steps">
                <span>01 · Choose your farm</span>
                <span>02 · Add your photo</span>
                <span>03 · Explore next steps</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
