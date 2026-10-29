import ManagementDashboard from "../officer/ManagementDashboard";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowUpRight,
  ArrowRight,
  Plus,
  ScanLine,
  ClipboardPen,
  CalendarDays,
  Map,
  Sprout,
  TriangleAlert,
  CloudSun,
  Droplets,
  Wind,
  ChevronRight,
  Sun,
  CloudRain,
  Leaf,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useApp } from "../../contexts/AppContext";
import { Badge, SectionTitle } from "../../components/common/UI";
import { photos } from "../../data/demo";
export default function Dashboard() {
  const { db, user, t, lang } = useApp();
  const farmer = user?.role === "farmer";
  if (!farmer) return <ManagementDashboard />;
  const stats = farmer
    ? [
        [
          "Total registered farms",
          db.farms.length,
          Map,
          "Across your growing land",
        ],
        [
          "Active crops",
          new Set(db.farms.map((f) => f.crop)).size,
          Sprout,
          "Growing this season",
        ],
        [
          "Pending crop alerts",
          db.reports.filter((r) => r.status === "Open").length,
          TriangleAlert,
          "Needs your attention",
        ],
        [
          "Upcoming activities",
          db.visits.length + 3,
          CalendarDays,
          "Your next steps this week",
        ],
      ]
    : [
        [
          "Registered farmers",
          db.users.filter((u) => u.role === "farmer").length,
          Map,
          "Fictional demonstration accounts",
        ],
        [
          "Registered farms",
          db.farms.length,
          Sprout,
          "Across sample locations",
        ],
        [
          "Open crop reports",
          db.reports.filter((r) => r.status === "Open").length,
          TriangleAlert,
          "Ready for your review",
        ],
        [
          "Scheduled visits",
          db.visits.length,
          CalendarDays,
          "Upcoming field consultations",
        ],
      ];
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">
            <span className="tiny-sun">☀</span> YOUR FARM, AT A GLANCE
          </span>
          <h1>
            {lang === "rw" ? "Muraho" : "Good morning"},{" "}
            {user?.name.split(" ")[0] || "Jean Claude"}{" "}
            <span className="wave">☀</span>
          </h1>
          <p>
            {farmer
              ? lang === "rw"
                ? "Dore uko imirima yawe imeze uyu munsi."
                : "Here’s what’s growing on your farm today. Let’s make it a good day."
              : "A clear view of your community’s farms, reports, and next steps."}
          </p>
        </div>
        <div className="heading-right">
          <span className="date-label">
            <CalendarDays size={15} />
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <Link className="button primary" to="/app/farms?add=1">
            <Plus size={17} />
            {t("Add Farm")}
          </Link>
        </div>
      </div>
      <section
        className="welcome-banner"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(17,56,38,.98) 0%,rgba(17,56,38,.92) 40%,rgba(17,56,38,.05) 100%),url(${photos.hills})`,
        }}
      >
        <div>
          <span className="banner-kicker">
            <span /> A NEW SEASON OF POSSIBILITIES
          </span>
          <h2>
            {t("Healthy crops.")}
            <br />
            {t("Stronger harvests.")}
          </h2>
          <p>
            A little care today makes a bigger difference tomorrow.
            <br />
            Keep an eye on your crops and grow with confidence.
          </p>
          <Link to="/app/monitoring" className="button cream">
            Check my crops <ArrowRight size={16} />
          </Link>
        </div>
        <div className="banner-note">
          <span>
            <Leaf size={18} />
          </span>
          <div>
            Rooted in Rwanda.
            <br />
            <strong>Growing for the future.</strong>
          </div>
        </div>
      </section>
      <div className="stats-grid">
        {stats.map(([label, value, Icon, detail], i) => {
          const I = Icon as typeof Map;
          return (
            <div className="stat-card" key={String(label)}>
              <div className="row between">
                <span className={"stat-icon " + (i === 2 ? "amber" : "")}>
                  <I size={20} />
                </span>
                <span className={"stat-trend " + (i === 2 ? "attention" : "")}>
                  {i === 2 ? (
                    "Action needed"
                  ) : (
                    <>
                      <TrendingUp size={12} /> This season
                    </>
                  )}
                </span>
              </div>
              <strong className="stat-number">
                {String(value).padStart(2, "0")}
              </strong>
              <h3>{String(label)}</h3>
              <p>{String(detail)}</p>
            </div>
          );
        })}
      </div>
      <section className="quick-actions">
        <span>{t("Let’s get things done")}</span>
        {[
          [Plus, "Add Farm", "farms?add=1"],
          [ScanLine, "Scan Crop", "detection"],
          [ClipboardPen, "Record Observation", "monitoring?add=1"],
          [CalendarDays, "Plan Harvest", "harvest"],
        ].map(([Icon, label, path]) => {
          const I = Icon as typeof Plus;
          return (
            <Link key={String(path)} to={"/app/" + path}>
              <I size={18} />
              {t(String(label))}
              <ChevronRight size={14} />
            </Link>
          );
        })}
      </section>
      <div className="dashboard-columns">
        <div className="dashboard-left">
          <section className="panel farms-panel">
            <SectionTitle
              title={t("My Farms")}
              to="/app/farms"
              label={t("View all farms")}
            />
            <p className="section-subtitle">
              {t("A little attention. A lot of potential.")}
            </p>
            <div className="farm-mini-grid">
              {db.farms.slice(0, 3).map((f, i) => (
                <Link
                  to={"/app/farms?view=" + f.id}
                  className="farm-mini"
                  key={f.id}
                >
                  <div className="farm-mini-image">
                    <img
                      src={f.image}
                      alt={f.crop + " crop in a demonstration farm"}
                      loading="lazy"
                    />
                    <Badge tone={i === 0 ? "amber" : "green"}>
                      {i === 0 ? "Needs attention" : "Healthy"}
                    </Badge>
                    <span className="image-arrow">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="farm-mini-body">
                    <h3>{f.name}</h3>
                    <p>
                      <Map size={12} />
                      {f.district} District
                    </p>
                    <div className="farm-mini-data">
                      <span>
                        <Sprout size={13} />
                        {f.crop}
                      </span>
                      <span>{f.area} ha</span>
                    </div>
                    <div className="growth-label">
                      <span>{f.stage}</span>
                      <span>{[45, 65, 78][i]}%</span>
                    </div>
                    <div className="progress">
                      <i style={{ width: [45, 65, 78][i] + "%" }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <section className="panel">
            <SectionTitle
              title={t("Harvest outlook")}
              to="/app/harvest"
              label="Explore planning"
            />
            <div className="row between chart-intro">
              <div>
                <span className="muted">Your next harvest, in perspective</span>
                <p>
                  <strong>
                    {db.harvests
                      .reduce((s, h) => s + h.area * h.yield, 0)
                      .toFixed(1)}{" "}
                    <small>tonnes</small>
                  </strong>
                  <Badge>Scenario total</Badge>
                </p>
              </div>
              <select aria-label="Harvest chart period">
                <option>Current season</option>
              </select>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart
                  data={[
                    { month: "Aug", estimated: 1.1 },
                    { month: "Sep", estimated: 1.8 },
                    { month: "Oct", estimated: 2.5 },
                    { month: "Nov", estimated: 2.1 },
                    { month: "Dec", estimated: 4.2 },
                    { month: "Jan", estimated: 4.8 },
                  ]}
                >
                  <defs>
                    <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#57a874" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#57a874" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="#edf0eb"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#88918b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#88918b" }}
                    unit=" t"
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="estimated"
                    stroke="#337b4f"
                    fill="url(#greenFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-disclaimer">
              <i /> Illustrative seasonal trend · Planning scenarios, not
              validated predictions
            </div>
          </section>
        </div>
        <div className="dashboard-right">
          <section className="panel weather-widget">
            <div className="row between">
              <h2>
                {t("Weather")} <Badge tone="neutral">Sample data</Badge>
              </h2>
              <Link to="/app/weather" aria-label="View weather">
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <p className="location">
              <Map size={13} /> Rwamagana, Eastern Province
            </p>
            <div className="current-weather">
              <div>
                <strong>
                  24<span>°C</span>
                </strong>
                <p>Partly cloudy</p>
                <small>Feels like 25° · H 26° / L 17°</small>
              </div>
              <CloudSun size={75} strokeWidth={1.4} />
            </div>
            <div className="weather-metrics">
              <span>
                <Droplets size={14} />
                72% humidity
              </span>
              <span>
                <Wind size={14} />8 km/h
              </span>
            </div>
            <div className="mini-forecast">
              {[
                ["Today", CloudSun, "24°"],
                ["Fri", CloudRain, "22°"],
                ["Sat", CloudRain, "21°"],
                ["Sun", Sun, "25°"],
              ].map(([day, Icon, temp]) => {
                const I = Icon as typeof Sun;
                return (
                  <div key={String(day)}>
                    <small>{String(day)}</small>
                    <I size={23} />
                    <strong>{String(temp)}</strong>
                  </div>
                );
              })}
            </div>
            <div className="weather-tip">
              <Droplets size={17} />
              <p>
                <strong>A little rain ahead</strong>Consider checking field
                drainage before Friday’s sample rainfall.
              </p>
            </div>
          </section>
          <section className="panel alerts-widget">
            <SectionTitle
              title={t("Heads up, farmer")}
              to="/app/notifications"
              label="View all"
            />
            {db.notices.slice(0, 2).map((n, i) => (
              <Link to="/app/notifications" key={n.id} className="alert-row">
                <span className={"alert-icon " + (i ? "green" : "amber")}>
                  {i ? <Sprout size={17} /> : <TriangleAlert size={17} />}
                </span>
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>
                    {i ? "Farming reminder" : "Sample weather alert"}
                  </small>
                </div>
              </Link>
            ))}
          </section>
          <Link className="advice-teaser" to="/app/advice">
            <BookOpen size={25} />
            <div>
              <strong>Better knowledge. Better harvests.</strong>
              <p>Practical advice for your next step.</p>
            </div>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </>
  );
}
