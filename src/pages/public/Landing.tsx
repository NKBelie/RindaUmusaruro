import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sprout,
  ScanLine,
  CloudSun,
  CalendarDays,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  Globe,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Brand, Badge } from "../../components/common/UI";
import { useApp } from "../../contexts/AppContext";
import { photos } from "../../data/demo";
export default function Landing() {
  const { t, lang, setLang, notify } = useApp();
  const [menu, setMenu] = useState(false);
  return (
    <div className="landing">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="public-header">
        <Brand />
        <nav className={menu ? "public-nav open" : "public-nav"}>
          {["Home", "Features", "How It Works", "About", "Contact"].map(
            (s, i) => (
              <a
                onClick={() => setMenu(false)}
                key={s}
                href={
                  ["#home", "#features", "#how-it-works", "#about", "#contact"][
                    i
                  ]
                }
              >
                {t(s)}
              </a>
            ),
          )}
        </nav>
        <div className="row">
          <button
            className="language"
            onClick={() => setLang(lang === "en" ? "rw" : "en")}
          >
            <Globe size={17} />
            {lang === "en" ? "EN" : "RW"}
            <ChevronDown size={12} />
          </button>
          <Link className="public-login" to="/login">
            {t("Login")}
          </Link>
          <Link className="button primary" to="/register">
            {t("Get Started")}
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button mobile-only"
            aria-label="Toggle navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main-content">
        <section className="public-hero" id="home">
          <div className="hero-copy">
            <span className="pill-eyebrow">
              <span /> ROOTED IN RWANDA. GROWING WITH YOU.
            </span>
            <h1>
              {lang === "rw" ? (
                <>
                  Rinda ibihingwa.
                  <br />
                  Ongera umusaruro.
                  <br />
                  <em>Tegura ejo hazaza.</em>
                </>
              ) : (
                <>
                  Protect your crops.
                  <br />
                  Improve your harvest.
                  <br />
                  <em>Secure your future.</em>
                </>
              )}
            </h1>
            <p>
              {lang === "rw"
                ? "RindaUmusaruro ifasha abahinzi bo mu Rwanda gukurikirana ibihingwa, kubona inama no gutegura umusaruro."
                : "A smarter way to care for your land. Monitor your crops, understand the weather, and plan a better harvest—with a farming companion built for Rwanda."}
            </p>
            <div className="hero-buttons">
              <Link className="button primary" to="/register">
                {t("Get Started")}
                <ArrowRight size={17} />
              </Link>
              <a className="button secondary" href="#features">
                Explore features
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="hero-trust">
              <span>
                <Check size={15} /> Designed for smallholder farmers
              </span>
              <span>
                <Globe size={15} /> English & Kinyarwanda
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src={photos.hills}
              alt="Green agricultural landscape illustrating the farming platform"
              fetchPriority="high"
            />
            <div className="hero-image-top">
              <Sprout size={18} /> Every field has potential.
            </div>
            <div className="hero-float weather-float">
              <span className="float-icon">
                <CloudSun size={32} />
              </span>
              <div>
                <small>YOUR DAY, A LITTLE CLEARER</small>
                <strong>
                  24°C <span>Partly cloudy</span>
                </strong>
                <p>Sample weather · Rwamagana</p>
              </div>
            </div>
            <div className="hero-float crop-float">
              <span className="float-icon">
                <ShieldCheck size={23} />
              </span>
              <div>
                <strong>A little care. A better harvest.</strong>
                <p>Stay connected to your crops.</p>
              </div>
              <span className="small-check">
                <Check size={13} />
              </span>
            </div>
            <div className="hero-photo-caption">
              Illustrative landscape photography · Hackathon prototype
            </div>
          </div>
        </section>
        <div className="value-strip">
          <span>Built around the way you farm.</span>
          {[
            [Sprout, "Your fields, connected"],
            [ScanLine, "Earlier awareness"],
            [CloudSun, "Smarter decisions"],
            [CalendarDays, "Better harvest planning"],
          ].map(([Icon, s]) => {
            const I = Icon as typeof Sprout;
            return (
              <div key={String(s)}>
                <I size={20} />
                {String(s)}
              </div>
            );
          })}
        </div>
        <section className="public-section" id="features">
          <div className="section-header">
            <span className="eyebrow">SMALL STEPS. STRONGER SEASONS.</span>
            <h2>
              Everything your farm needs.
              <br />
              <em>One simple place.</em>
            </h2>
            <p>
              Less guesswork. More understanding. Practical tools that turn your
              daily farming observations into better decisions.
            </p>
          </div>
          <div className="feature-grid">
            {[
              [
                Sprout,
                "Smart Crop Monitoring",
                "Keep every field in view. Record crop conditions, planting dates, and the small changes that matter.",
                "monitoring",
              ],
              [
                ScanLine,
                "AI-Assisted Disease Awareness",
                "Explore clearly labeled demo assessments and share crop concerns with an extension officer.",
                "detection",
              ],
              [
                CloudSun,
                "Weather Intelligence",
                "See an illustrative seven-day outlook and practical weather-related farming tips.",
                "weather",
              ],
              [
                CalendarDays,
                "Harvest Planning",
                "Explore yield scenarios, prepare for harvest, and compare your expectations with actual results.",
                "harvest",
              ],
              [
                BookOpen,
                "Agricultural Advisory",
                "Find understandable farming guidance and connect observations with practical next steps.",
                "advice",
              ],
              [
                ChartNoAxesCombined,
                "Farm Productivity Analytics",
                "Look back at your farming records and see the story of your growing season.",
                "reports",
              ],
            ].map(([Icon, title, description, path], i) => {
              const I = Icon as typeof Sprout;
              return (
                <Link
                  to={"/login?next=" + path}
                  className="feature-card"
                  key={String(title)}
                >
                  <span className={"feature-icon tone-" + (i % 3)}>
                    <I size={25} />
                  </span>
                  <h3>{String(title)}</h3>
                  <p>{String(description)}</p>
                  <span className="feature-link">
                    Explore tool <ArrowUpRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="how-section" id="how-it-works">
          <div className="section-header">
            <span className="eyebrow">
              FROM YOUR FIRST FIELD TO YOUR NEXT HARVEST
            </span>
            <h2>
              A simpler way to <em>grow forward.</em>
            </h2>
          </div>
          <div className="steps-grid">
            {[
              [
                "Create your account",
                "Start in English or Kinyarwanda, on your phone or computer.",
              ],
              [
                "Register your farm",
                "Add your fields, crops, and the dates that matter.",
              ],
              [
                "Stay close to your crops",
                "Record observations, explore advice, and ask for support.",
              ],
              [
                "Make the next season better",
                "Plan your harvest and learn from your own records.",
              ],
            ].map(([title, desc], i) => (
              <div key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <Link className="button primary" to="/login">
            Try the complete demo <ArrowRight size={17} />
          </Link>
        </section>
        <section className="public-section about-section" id="about">
          <div className="about-image">
            <img
              src={photos.field}
              alt="Illustrative green farmland"
              loading="lazy"
            />
            <span>
              Built for the people
              <br />
              who keep us growing.
            </span>
          </div>
          <div className="about-copy">
            <span className="eyebrow">
              A FARMING COMPANION, NOT ANOTHER COMPLICATION
            </span>
            <h2>
              Your land. Your knowledge.
              <br />
              <em>A little extra support.</em>
            </h2>
            <p>
              RindaUmusaruro brings useful information closer to smallholder
              farmers, extension officers, and cooperatives in Rwanda.
            </p>
            {[
              "Simple tools that work across phones and computers",
              "Core workflows in English and Kinyarwanda",
              "Field records saved locally in your browser",
              "Clear boundaries between demo scenarios and real advice",
            ].map((s) => (
              <p className="check-line" key={s}>
                <span>
                  <Check size={15} />
                </span>
                {s}
              </p>
            ))}
            <Link className="text-link" to="/login">
              Find your farming workspace <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <section className="preview-section">
          <div className="section-header">
            <span className="eyebrow">
              A CLEARER VIEW OF YOUR GROWING WORLD
            </span>
            <h2>
              Your next farming day, <em>made simpler.</em>
            </h2>
            <p>
              Explore a working prototype with connected farmer, extension
              officer, and administrator workspaces.
            </p>
          </div>
          <Link to="/login" className="dashboard-preview">
            <div className="preview-sidebar">
              <Sprout size={28} />
              <span>Overview</span>
              <span>My farms</span>
              <span>Crop monitoring</span>
              <span>Harvest planning</span>
            </div>
            <div className="preview-main">
              <div className="row between">
                <h3>Good morning, Jean Claude ☀</h3>
                <Badge>Demo workspace</Badge>
              </div>
              <div
                className="preview-banner"
                style={{
                  backgroundImage: `linear-gradient(90deg,#18442eea,#18442e40),url(${photos.hills})`,
                }}
              >
                <h2>
                  Healthy crops.
                  <br />
                  Stronger harvests.
                </h2>
              </div>
              <div className="preview-stats">
                <span>
                  <b>03</b>Registered farms
                </span>
                <span>
                  <b>03</b>Active crops
                </span>
                <span>
                  <b>01</b>Crop report
                </span>
                <span>
                  <b>03</b>Harvest plans
                </span>
              </div>
              <span className="preview-open">
                Open the interactive demo <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
          <p className="caption">
            Illustrative workspace with fictional sample records.
          </p>
        </section>
        <section className="public-section faq-section">
          <div>
            <span className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</span>
            <h2>
              A little more
              <br />
              <em>understanding.</em>
            </h2>
            <p>Clear answers before you begin.</p>
          </div>
          <div>
            {[
              [
                "Is this a live agricultural service?",
                "This is a hackathon prototype. It uses fictional records, browser-local storage, and clearly labeled sample services.",
              ],
              [
                "Does the platform diagnose crop diseases?",
                "No. The prototype presents preconfigured scenarios selected by you. Uploaded images are previewed but are not analyzed by a trained AI model.",
              ],
              [
                "Can I use it in Kinyarwanda?",
                "Yes. Use the language toggle for major navigation and core farmer workflows. Translation content needs fluent specialist review before production.",
              ],
              [
                "Will my records stay saved?",
                "Records are saved in your current browser’s local storage. Clearing browser data removes them. Export records from Settings to keep a copy.",
              ],
              [
                "How can an extension officer help?",
                "Send a report from the crop assessment page, switch to the officer demo, add advice and resolve it, then return to the farmer’s notifications.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={17} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div>
            <span className="eyebrow">LET’S GROW SOMETHING BETTER</span>
            <h2>
              A brighter harvest
              <br />
              starts with a conversation.
            </h2>
            <p>
              Have feedback about the prototype? Leave a demonstration message.
            </p>
            <span>
              <MapPin size={17} /> Designed for Rwanda
            </span>
          </div>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const messages = JSON.parse(
                localStorage.getItem("rinda-feedback") || "[]",
              );
              localStorage.setItem(
                "rinda-feedback",
                JSON.stringify([...messages, Object.fromEntries(f)]),
              );
              notify(
                "Demo feedback saved locally. No message was sent externally.",
              );
              e.currentTarget.reset();
            }}
          >
            <div className="form-grid">
              <label>
                Your name
                <input name="name" required placeholder="Full name" />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label>
              Your message
              <textarea
                name="message"
                required
                placeholder="What would make your farming day better?"
              />
            </label>
            <button className="button cream">
              <Mail size={17} />
              Save demo feedback
            </button>
            <small>Saved in this browser. This form does not send email.</small>
          </form>
        </section>
      </main>
      <footer className="public-footer">
        <div>
          <Brand />
          <p>
            A little smarter farming.
            <br />A better tomorrow.
          </p>
        </div>
        <div>
          <strong>Explore</strong>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About the platform</a>
        </div>
        <div>
          <strong>Your workspace</strong>
          <Link to="/login">Farmer demo</Link>
          <Link to="/login">Extension officer demo</Link>
          <Link to="/login">Administrator demo</Link>
        </div>
        <div className="footer-note">
          <Badge>Hackathon prototype</Badge>
          <p>
            Agricultural Productivity · Rwanda
            <br />
            Fictional data. Real possibilities.
          </p>
        </div>
        <div className="public-footer-bottom">
          <span>© 2026 RindaUmusaruro. Smart Farming, Better Harvests.</span>
          <span>Made with care, for those who grow.</span>
        </div>
      </footer>
    </div>
  );
}
