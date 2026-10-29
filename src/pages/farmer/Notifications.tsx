import Announcement from "../../components/forms/Announcement";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Badge, Empty, Modal } from "../../components/common/UI";
import type { Notice } from "../../types";
export default function Notifications() {
  const { db, setDb, t, notify, user } = useApp();
  const [showReminders] = useLocalStorage("rinda-reminders", true);
  const [filter, setFilter] = useState("All notifications");
  const [selected, setSelected] = useState<Notice | null>(null);
  const [clear, setClear] = useState(false);
  const list = db.notices
    .filter((n) => showReminders || n.category !== "Farming Reminders")
    .filter(
      (n) =>
        filter === "All notifications" ||
        (filter === "Unread" ? !n.read : n.category === filter),
    );
  return (
    <>
      <Heading
        title={t("Notifications")}
        subtitle={t("The timely reminders that help you stay a step ahead.")}
        action={
          <div className="row">
            {user?.role === "admin" && <Announcement />}
            <button
              className="button secondary"
              onClick={() => {
                setDb((d) => ({
                  ...d,
                  notices: d.notices.map((n) => ({ ...n, read: true })),
                }));
                notify("All notifications marked as read");
              }}
            >
              <CheckCheck size={17} />
              {t("Mark all as read")}
            </button>
          </div>
        }
      />
      <div className="toolbar panel">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter notifications"
        >
          {[
            "All notifications",
            "Unread",
            "Crop Health Alerts",
            "Weather Alerts",
            "Farming Reminders",
            "Harvest Reminders",
            "Extension Officer Responses",
            "System Announcements",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="muted">
          {db.notices.filter((n) => !n.read).length} unread
        </span>
        <button className="button secondary" onClick={() => setClear(true)}>
          <Trash2 size={16} />
          {t("Clear all")}
        </button>
      </div>
      <section className="panel">
        {list.map((n) => (
          <button
            className={"notification-row " + (!n.read ? "unread" : "")}
            key={n.id}
            onClick={() => {
              setSelected(n);
              setDb((d) => ({
                ...d,
                notices: d.notices.map((x) =>
                  x.id === n.id ? { ...x, read: true } : x,
                ),
              }));
            }}
          >
            <span className="large-icon">
              <Bell size={21} />
            </span>
            <div>
              <div className="row">
                <h3>{n.title}</h3>
                {!n.read && <span className="unread-dot" />}
              </div>
              <p>{n.body}</p>
              <Badge tone="neutral">{n.category}</Badge>
            </div>
          </button>
        ))}
        {!list.length && <Empty text="You’re all caught up." />}
      </section>
      {selected && (
        <Modal title={selected.title} close={() => setSelected(null)}>
          <Badge>{selected.category}</Badge>
          <p>{selected.body}</p>
          <button
            className="button secondary"
            onClick={() => {
              setDb((d) => ({
                ...d,
                notices: d.notices.filter((n) => n.id !== selected.id),
              }));
              setSelected(null);
              notify("Notification removed");
            }}
          >
            Remove notification
          </button>
        </Modal>
      )}
      {clear && (
        <Modal title="Clear all notifications?" close={() => setClear(false)}>
          <p>This removes notifications from this browser’s demo data.</p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setClear(false)}
            >
              Cancel
            </button>
            <button
              className="button danger-button"
              onClick={() => {
                setDb((d) => ({ ...d, notices: [] }));
                setClear(false);
                notify("Notifications cleared");
              }}
            >
              {t("Clear all")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
