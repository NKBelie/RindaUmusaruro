import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Sprout,
  ScanLine,
  CloudSun,
  CalendarDays,
  BookOpen,
  Bell,
  ChartNoAxesCombined,
  UserRound,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Search,
  CircleHelp,
  Users,
  ClipboardList,
  X,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Brand } from "../common/UI";
const farmer = [
  ["Dashboard", "dashboard", LayoutDashboard],
  ["My Farms", "farms", Map],
  ["Crop Monitoring", "monitoring", Sprout],
  ["Disease Detection", "detection", ScanLine],
  ["Weather", "weather", CloudSun],
  ["Harvest Planning", "harvest", CalendarDays],
  ["Agricultural Advice", "advice", BookOpen],
  ["Notifications", "notifications", Bell],
  ["Reports", "reports", ChartNoAxesCombined],
] as const;
export default function Layout() {
  const { user, setUser, db, lang, setLang, t } = useApp();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = user?.role || "farmer";
  const items: readonly (readonly [string, string, LucideIcon])[] =
    role === "farmer"
      ? farmer
      : role === "officer"
        ? [
            farmer[0],
            ["Farmer directory", "users", Users],
            farmer[1],
            ["Crop Reports", "reports", ClipboardList],
            ["Field Visits", "visits", CalendarDays],
            farmer[6],
            farmer[7],
          ]
        : [
            farmer[0],
            ["User Management", "users", Users],
            farmer[1],
            ["Crop Reports", "reports", ClipboardList],
            ["Advisory Content", "advice", BookOpen],
            farmer[7],
            ["Analytics", "analytics", ChartNoAxesCombined],
          ];
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="mobile-only icon-button"
            onClick={() => setMobile(false)}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <div className="workspace-label">
          {role === "farmer"
            ? "FARMER WORKSPACE"
            : role === "officer"
              ? "EXTENSION WORKSPACE"
              : "ADMIN WORKSPACE"}
        </div>
        <nav>
          {items.map(([label, path, Icon]) => (
            <NavLink
              key={path}
              to={"/app/" + path}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={19} />
              <span>{t(label)}</span>
              {path === "notifications" && (
                <span className="nav-count">
                  {db.notices.filter((n) => !n.read).length}
                </span>
              )}
              {path === "detection" && <span className="new-label">DEMO</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">
              <Sprout />
            </span>
            <strong>
              A little guidance.
              <br />A better harvest.
            </strong>
            <p>
              Your farming companion,
              <br />
              every step of the way.
            </p>
            <Link to="/app/advice">
              Explore farming advice <ArrowUpRight size={14} />
            </Link>
          </div>
          <NavLink to="/app/profile" className="nav-item">
            <UserRound size={19} />
            {t("Profile")}
          </NavLink>
          <NavLink to="/app/settings" className="nav-item">
            <Settings size={19} />
            {t("Settings")}
          </NavLink>
          <button
            className="nav-item logout"
            onClick={() => {
              setUser(null);
              navigate("/login");
            }}
          >
            <LogOut size={18} />
            {t("Sign out")}
          </button>
          <div className="sidebar-foot">
            Made for Rwanda <span>◈</span>
          </div>
        </div>
      </aside>
      {mobile && (
        <div className="nav-overlay" onClick={() => setMobile(false)} />
      )}
      <div className="app-main">
        <header className="topbar">
          <div className="row">
            <button
              className="icon-button mobile-only"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
            <span className="breadcrumb">
              {role === "farmer"
                ? "My workspace"
                : role === "officer"
                  ? "Extension services"
                  : "Administration"}{" "}
              <span>/</span> <strong>Overview</strong>
            </span>
          </div>
          <div className="top-actions">
            <form
              className="top-search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/app/farms?q=" + encodeURIComponent(search));
              }}
            >
              <Search size={16} />
              <input
                aria-label="Search farms"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd>↵</kbd>
            </form>
            <button
              className="language"
              onClick={() => setLang(lang === "en" ? "rw" : "en")}
            >
              <Globe size={16} />
              {lang === "en" ? "EN" : "RW"}
              <ChevronDown size={12} />
            </button>
            <Link
              className="notification-button"
              aria-label="Notifications"
              to="/app/notifications"
            >
              <Bell size={20} />
              {db.notices.some((n) => !n.read) && <i />}
            </Link>
            <div className="top-user">
              <span className="avatar">
                {user?.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("") || "JC"}
              </span>
              <div>
                <strong>{user?.name || "Jean Claude"}</strong>
                <small>
                  {role === "farmer"
                    ? "Farmer"
                    : role === "officer"
                      ? "Extension officer"
                      : "Administrator"}
                </small>
              </div>
              <Link to="/app/profile" aria-label="Open profile">
                <ChevronDown size={15} />
              </Link>
            </div>
          </div>
        </header>
        <main className="content" id="main-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>© 2026 RindaUmusaruro. Growing a better tomorrow.</span>
          <span>
            <i /> Demo Mode <span className="footer-divider">|</span> Fictional
            data for demonstration{" "}
            <Link to="/app/settings">
              <CircleHelp size={15} />
            </Link>
          </span>
        </footer>
      </div>
    </div>
  );
}
