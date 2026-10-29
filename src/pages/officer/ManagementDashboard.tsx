import { Link } from "react-router-dom";
import {
  Users,
  Map,
  ClipboardList,
  CalendarDays,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Badge, SectionTitle } from "../../components/common/UI";
import Analytics from "../admin/Analytics";
export default function ManagementDashboard() {
  const { db, user } = useApp();
  const admin = user?.role === "admin";
  const counts = admin
    ? [
        [
          "Registered farmers",
          db.users.filter((u) => u.role === "farmer").length,
          Users,
        ],
        [
          "Extension officers",
          db.users.filter((u) => u.role === "officer").length,
          Users,
        ],
        ["Registered farms", db.farms.length, Map],
        ["Crop reports", db.reports.length, ClipboardList],
        [
          "Advisory notices",
          db.notices.filter((n) => n.category !== "System Announcements")
            .length,
          BookOpen,
        ],
      ]
    : [
        [
          "Assigned farmers",
          db.users.filter((u) => u.role === "farmer").length,
          Users,
        ],
        ["Registered farms", db.farms.length, Map],
        [
          "Open crop reports",
          db.reports.filter((r) => r.status === "Open").length,
          ClipboardList,
        ],
        ["Scheduled visits", db.visits.length, CalendarDays],
      ];
  return (
    <>
      <Heading
        eyebrow={
          admin
            ? "PLATFORM OVERVIEW"
            : "A LITTLE SUPPORT. A STRONGER COMMUNITY."
        }
        title={
          admin
            ? "A clear view of your growing platform."
            : `Good morning, ${user?.name.split(" ")[0]}.`
        }
        subtitle="All accounts, locations, and regional counts below are fictional demonstration records."
        action={<Badge tone="amber">Demo Mode</Badge>}
      />
      <div className={"stats-grid " + (admin ? "admin-stats" : "")}>
        {counts.map(([label, value, Icon]) => {
          const I = Icon as typeof Users;
          return (
            <div className="stat-card" key={String(label)}>
              <span className="stat-icon">
                <I size={20} />
              </span>
              <strong className="stat-number">
                {String(value).padStart(2, "0")}
              </strong>
              <h3>{String(label)}</h3>
            </div>
          );
        })}
      </div>
      <div className="two-columns spaced">
        <section className="panel padded">
          <SectionTitle
            title="Reports that need your attention"
            to="/app/reports"
          />
          {db.reports
            .filter((r) => r.status === "Open")
            .slice(0, 4)
            .map((r) => (
              <Link className="list-row" key={r.id} to="/app/reports">
                <span className="large-icon">
                  <ClipboardList size={20} />
                </span>
                <div>
                  <strong>{r.issue}</strong>
                  <p>
                    {db.farms.find((f) => f.id === r.farmId)?.name ||
                      "Removed farm"}{" "}
                    · {r.crop}
                  </p>
                  <small>{r.date}</small>
                </div>
                <ArrowUpRight size={17} />
              </Link>
            ))}
          {!db.reports.some((r) => r.status === "Open") && (
            <div className="empty">
              <CheckCircle2 />
              <h3>No reports waiting for review.</h3>
            </div>
          )}
        </section>
        <section className="panel padded">
          <SectionTitle
            title={
              admin
                ? "Manage your demonstration platform"
                : "Your next field visits"
            }
            to={admin ? "/app/users" : "/app/visits"}
            label={admin ? "Manage users" : "Schedule a visit"}
          />
          {admin ? (
            <>
              <p className="muted">
                Manage fictional accounts and share demonstration advisory
                content.
              </p>
              <div className="list-row">
                <Users />
                <Link to="/app/users">User and officer management</Link>
                <ArrowUpRight size={16} />
              </div>
              <div className="list-row">
                <BookOpen />
                <Link to="/app/advice">Advisory content library</Link>
                <ArrowUpRight size={16} />
              </div>
              <div className="list-row">
                <Map />
                <Link to="/app/farms">Registered farm records</Link>
                <ArrowUpRight size={16} />
              </div>
            </>
          ) : (
            <>
              {db.visits.slice(0, 3).map((v) => (
                <div className="list-row" key={v.id}>
                  <CalendarDays />
                  <div>
                    <strong>{v.farmer}</strong>
                    <p>
                      {v.date} · {v.note}
                    </p>
                  </div>
                </div>
              ))}
              {!db.visits.length && (
                <div className="empty">
                  <CalendarDays />
                  <h3>Make room for your next field visit.</h3>
                  <Link className="button secondary" to="/app/visits">
                    Schedule a consultation
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      {admin ? (
        <div className="spaced">
          <Analytics />
        </div>
      ) : (
        <section className="panel padded spaced">
          <h2>Regional farm summary</h2>
          <p className="muted">
            Sample regional records visible to this officer workspace.
          </p>
          {[...new Set(db.farms.map((f) => f.district))].map((district) => (
            <div className="list-row" key={district}>
              <Map />
              <div>
                <strong>{district}</strong>
                <p>
                  {db.farms
                    .filter((f) => f.district === district)
                    .map((f) => f.crop)
                    .join(", ")}
                </p>
              </div>
              <Badge>
                {db.farms.filter((f) => f.district === district).length} farms
              </Badge>
              <Badge tone="amber">
                {
                  db.reports.filter(
                    (r) =>
                      r.status === "Open" &&
                      db.farms.find((f) => f.id === r.farmId)?.district ===
                        district,
                  ).length
                }{" "}
                open reports
              </Badge>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
