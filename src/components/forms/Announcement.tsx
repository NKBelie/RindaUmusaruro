import { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Modal } from "../common/UI";
import { uid } from "../../services/mock";
export default function Announcement() {
  const { setDb, notify } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="button primary" onClick={() => setOpen(true)}>
        <Plus size={16} />
        Create notice
      </button>
      {open && (
        <Modal
          title="Create a demonstration notice"
          close={() => setOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setDb((d) => ({
                ...d,
                notices: [
                  {
                    id: uid(),
                    title: String(f.get("title")),
                    body: String(f.get("body")),
                    category: String(f.get("category")),
                    read: false,
                  },
                  ...d.notices,
                ],
              }));
              setOpen(false);
              notify("Demonstration notice published to the local workspace.");
            }}
          >
            <label>
              Notice title
              <input required name="title" />
            </label>
            <label>
              Category
              <select name="category">
                {[
                  "System Announcements",
                  "Crop Health Alerts",
                  "Weather Alerts",
                  "Farming Reminders",
                  "Harvest Reminders",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea required name="body" />
            </label>
            <p className="form-hint">
              Visible in this browser’s shared demo records. No SMS, email, or
              push message is sent.
            </p>
            <button className="button primary wide">Publish demo notice</button>
          </form>
        </Modal>
      )}
    </>
  );
}
