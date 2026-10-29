import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Sprout,
  UserRound,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Brand, Badge } from "../../components/common/UI";
import { locations, photos } from "../../data/demo";
import { uid } from "../../services/mock";
import type { Role, User } from "../../types";
interface Credential {
  userId: string;
  identifier: string;
  password: string;
}
export default function Auth() {
  const { db, setDb, setUser, notify, t, lang, setLang } = useApp();
  const path = useLocation().pathname;
  const register = path === "/register";
  const forgot = path === "/forgot-password";
  const reset = path === "/reset-password";
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [province, setProvince] = useState("Eastern");
  const [district, setDistrict] = useState("Rwamagana");
  const [sector, setSector] = useState("Muhazi");
  const [identifier, setIdentifier] = useState("");
  const title = register
    ? "Your next chapter starts here."
    : forgot
      ? "A fresh start for your account."
      : reset
        ? "Choose a new demo password."
        : "Welcome back to your growing world.";
  const demo = (role: Role) => {
    const found = db.users.find((u) => u.role === role);
    if (found) {
      setUser(found);
      navigate("/app/dashboard");
      notify("Signed in to " + role + " demonstration");
    } else
      setError(
        "This demo account was removed. Reset demo data from an existing account.",
      );
  };
  return (
    <div className="auth-page">
      <aside
        className="auth-visual"
        style={{
          backgroundImage: `linear-gradient(180deg,#153b2ba0,#153b2bdf),url(${photos.hills})`,
        }}
      >
        <Brand />
        <div>
          <Badge tone="neutral">ROOTED IN RWANDA</Badge>
          <h1>
            Good things
            <br />
            take a little
            <br />
            <em>growing.</em>
          </h1>
          <p>
            Smart farming. Better harvests.
            <br />A brighter tomorrow, together.
          </p>
          <Sprout size={65} strokeWidth={1} />
        </div>
        <small>Hackathon prototype · Agricultural Productivity</small>
      </aside>
      <main className="auth-form">
        <div className="auth-top">
          <Link to="/">← Back to home</Link>
          <button
            className="language"
            onClick={() => setLang(lang === "en" ? "rw" : "en")}
          >
            {lang === "en" ? "English" : "Kinyarwanda"} ↕
          </button>
        </div>
        <div className="auth-content">
          <span className="eyebrow">WELCOME TO RINDAUMUSARURO</span>
          <h1>{title}</h1>
          <p>
            {register
              ? "Create a farmer account and give your fields a smarter future."
              : forgot
                ? "Enter your registered phone or email to simulate password recovery."
                : reset
                  ? "This reset changes only this browser’s prototype account."
                  : "A little clarity for your fields. A little confidence for your day."}
          </p>
          {!register && !forgot && !reset && (
            <>
              <div className="demo-signin">
                <div className="row between">
                  <strong>{t("Explore the prototype")}</strong>
                  <Badge tone="amber">Demo Mode</Badge>
                </div>
                <p>{t("Choose a role. No password needed.")}</p>
                <div className="demo-roles">
                  {(
                    [
                      ["farmer", UserRound, "Farmer"],
                      ["officer", Users, "Extension officer"],
                      ["admin", ShieldCheck, "Administrator"],
                    ] as const
                  ).map(([role, Icon, label]) => (
                    <button key={role} onClick={() => demo(role)}>
                      <Icon size={23} />
                      <strong>{label}</strong>
                      <ArrowRight size={15} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="or-divider">
                <span>or sign in to your local account</span>
              </div>
            </>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              const f = new FormData(e.currentTarget);
              const password = String(f.get("password") || "");
              const credentials: Credential[] = JSON.parse(
                localStorage.getItem("rinda-credentials") || "[]",
              );
              if (register) {
                if (password !== f.get("confirm")) {
                  setError("The passwords do not match.");
                  return;
                }
                const phone = String(f.get("phone"));
                const email = String(f.get("email"));
                if (
                  db.users.some(
                    (u) => u.phone === phone || (email && u.email === email),
                  )
                ) {
                  setError(
                    "An account with this phone or email already exists.",
                  );
                  return;
                }
                const user: User = {
                  id: uid(),
                  name: String(f.get("name")),
                  phone,
                  email,
                  role: "farmer",
                  district,
                  province,
                  sector,
                  village: String(f.get("village")),
                  language: String(f.get("language")),
                };
                setDb((d) => ({ ...d, users: [...d.users, user] }));
                localStorage.setItem(
                  "rinda-credentials",
                  JSON.stringify([
                    ...credentials,
                    { userId: user.id, identifier: phone, password },
                  ]),
                );
                setLang(String(f.get("language")));
                setUser(user);
                navigate("/app/dashboard");
                notify("Your local farmer account is ready.");
              } else if (forgot) {
                const u = db.users.find(
                  (u) => u.phone === identifier || u.email === identifier,
                );
                if (!u) {
                  setError("No local account matches this phone or email.");
                  return;
                }
                sessionStorage.setItem("rinda-reset", u.id);
                navigate("/reset-password");
                notify("Demo recovery verified. No SMS or email was sent.");
              } else if (reset) {
                if (password !== f.get("confirm")) {
                  setError("The passwords do not match.");
                  return;
                }
                const id = sessionStorage.getItem("rinda-reset");
                if (!id) {
                  setError("Start password recovery first.");
                  return;
                }
                const u = db.users.find((u) => u.id === id);
                if (!u) {
                  setError("Account no longer exists.");
                  return;
                }
                localStorage.setItem(
                  "rinda-credentials",
                  JSON.stringify([
                    ...credentials.filter((c) => c.userId !== id),
                    { userId: id, identifier: u.phone, password },
                  ]),
                );
                sessionStorage.removeItem("rinda-reset");
                navigate("/login");
                notify("Local demo password reset.");
              } else {
                const u = db.users.find(
                  (u) => u.phone === identifier || u.email === identifier,
                );
                const cred = credentials.find((c) => c.userId === u?.id);
                if (!u || !cred || cred.password !== password) {
                  setError(
                    "Phone/email or password is incorrect. Use a demo role or register a local account.",
                  );
                  return;
                }
                setUser(u);
                navigate("/app/dashboard");
              }
            }}
          >
            {register ? (
              <>
                <div className="form-grid">
                  <label className="full">
                    {t("Full name")}
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="Your full name"
                    />
                  </label>
                  <label>
                    {t("Phone number")}
                    <input
                      name="phone"
                      type="tel"
                      pattern="\+?[0-9 ]{10,16}"
                      required
                      placeholder="0780 000 000"
                    />
                  </label>
                  <label>
                    {t("Email (optional)")}
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
              </>
            ) : (
              !reset && (
                <label>
                  {t("Phone number or email")}
                  <input
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Your phone or email"
                  />
                </label>
              )
            )}
            {!forgot && (
              <>
                <label>
                  {t("Password")}
                  <div className="password-field">
                    <input
                      name="password"
                      type={show ? "text" : "password"}
                      autoComplete={
                        register || reset ? "new-password" : "current-password"
                      }
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                {(register || reset) && (
                  <label>
                    {t("Confirm password")}
                    <input
                      name="confirm"
                      type={show ? "text" : "password"}
                      required
                      minLength={8}
                    />
                  </label>
                )}
              </>
            )}
            {register && (
              <div className="form-grid">
                <label>
                  {t("Province")}
                  <select
                    value={province}
                    onChange={(e) => {
                      const p = e.target.value;
                      const d = Object.keys(locations[p])[0];
                      setProvince(p);
                      setDistrict(d);
                      setSector(locations[p][d][0]);
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
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setSector(locations[province][e.target.value][0]);
                    }}
                  >
                    {Object.keys(locations[province]).map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("Sector")}
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  >
                    {locations[province][district].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("Village")}
                  <input name="village" required placeholder="Your village" />
                </label>
                <label className="full">
                  {t("Preferred language")}
                  <select name="language">
                    <option value="en">English</option>
                    <option value="rw">Kinyarwanda</option>
                  </select>
                </label>
                <p className="form-hint full">
                  Sample location directory for demonstration. Province,
                  district, and sector choices are dependent.
                </p>
              </div>
            )}
            {!register && !reset && !forgot && (
              <Link className="forgot-link" to="/forgot-password">
                Forgot password?
              </Link>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary wide">
              {register
                ? t("Get Started")
                : forgot
                  ? "Continue demo recovery"
                  : reset
                    ? "Reset demo password"
                    : t("Login")}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-switch">
            {register ? "Already have an account?" : "New to RindaUmusaruro?"}{" "}
            <Link to={register ? "/login" : "/register"}>
              {register ? "Sign in" : "Create an account"}
            </Link>
          </p>
          <div className="auth-disclaimer">
            <ShieldCheck size={18} />
            <span>
              Prototype authentication uses local storage and is not
              production-grade security. Please use fictional information.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
