import { useState } from "react";
import { Download, Globe, ShieldCheck } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Heading, Modal } from "../../components/common/UI";
import { seed } from "../../data/demo";
export default function Profile({ settings = false }: { settings?: boolean }) {
  const { user, setUser, db, setDb, lang, setLang, t, notify } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [district, setDistrict] = useState(user?.district || "");
  const [reminders, setReminders] = useLocalStorage("rinda-reminders", true);
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Heading
        title={t(settings ? "Settings" : "Profile")}
        subtitle={
          settings
            ? "Make your farming workspace feel right for you."
            : "Your information, ready for your next growing season."
        }
      />
      <div className="two-columns">
        <section className="panel padded">
          {settings ? (
            <>
              <h2>
                <Globe size={21} /> Language and preferences
              </h2>
              <label>
                {t("Preferred language")}
                <select value={lang} onChange={(e) => setLang(e.target.value)}>
                  <option value="en">English</option>
                  <option value="rw">Kinyarwanda</option>
                </select>
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => {
                    setReminders(e.target.checked);
                    notify("Reminder preference saved");
                  }}
                />
                Show farming reminder notifications
              </label>
              <p className="muted">Preferences are saved in this browser.</p>
              <h3>Export your demo data</h3>
              <button
                className="button secondary"
                onClick={() => {
                  const url = URL.createObjectURL(
                    new Blob([JSON.stringify(db, null, 2)], {
                      type: "application/json",
                    }),
                  );
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "rinda-demo-data.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={17} />
                Download all records
              </button>
              <h3>Start a fresh demonstration</h3>
              <button
                className="button secondary danger"
                onClick={() => setConfirm(true)}
              >
                Reset demo records
              </button>
            </>
          ) : (
            <>
              <span className="profile-avatar">
                {name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <h2>{name}</h2>
              <p className="muted">{user?.role} · Demo account</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (user) {
                    const updated = { ...user, name, phone, email, district };
                    setUser(updated);
                    setDb((d) => ({
                      ...d,
                      users: d.users.map((u) =>
                        u.id === user.id ? updated : u,
                      ),
                    }));
                    notify("Profile updated");
                  }
                }}
              >
                <label>
                  {t("Full name")}
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  {t("Phone number")}
                  <input
                    required
                    type="tel"
                    pattern="\+?[0-9 ]{10,16}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label>
                  {t("Email (optional)")}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  {t("District")}
                  <input
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </label>
                <button className="button primary">{t("Save profile")}</button>
              </form>
            </>
          )}
        </section>
        <section className="panel padded">
          <span className="large-icon">
            <ShieldCheck />
          </span>
          <h2>A transparent prototype</h2>
          <p>
            RindaUmusaruro is a hackathon demonstration for Rwanda’s
            agricultural productivity track.
          </p>
          <div className="notice amber">
            <p>
              Authentication uses browser-local data and is not production-grade
              security. Use fictional information and a demo password.
            </p>
          </div>
          <p>
            Crop assessments use selected scenarios. Weather is sample data.
            Harvest estimates are calculations based on your inputs.
          </p>
          <p className="muted">
            Kinyarwanda interface translations are editable in src/locales and
            need review by a fluent agricultural specialist before production.
          </p>
          <a className="button secondary" href="/login">
            Switch demonstration account
          </a>
        </section>
      </div>
      {confirm && (
        <Modal
          title="Reset demonstration records?"
          close={() => setConfirm(false)}
        >
          <p>
            This replaces local farm, report, harvest, and account records with
            the original sample data. Export your records first if needed.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="button danger-button"
              onClick={() => {
                setDb(seed);
                setUser(
                  seed.users.find((u) => u.role === user?.role) ||
                    seed.users[0],
                );
                setConfirm(false);
                notify("Demo data reset");
              }}
            >
              Reset records
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
