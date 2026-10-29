import { useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Modal, Empty, Badge } from "../../components/common/UI";
import { today, uid } from "../../services/mock";
export default function Visits() {
  const { db, setDb, notify, t } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Heading
        title={t("Field Visits")}
        subtitle="Make time for the farmers and fields that need you."
        action={
          <button className="button primary" onClick={() => setOpen(true)}>
            <Plus size={17} />
            Schedule visit
          </button>
        }
      />
      <section className="panel padded">
        {!db.visits.length ? (
          <Empty text="Your next field visit starts here.">
            <button className="button secondary" onClick={() => setOpen(true)}>
              Schedule a consultation
            </button>
          </Empty>
        ) : (
          db.visits.map((v) => (
            <div className="list-row" key={v.id}>
              <CalendarDays />
              <div>
                <strong>{v.farmer}</strong>
                <p>{v.note}</p>
                <small>{v.date}</small>
              </div>
              <Badge>{v.date < today() ? "Visit history" : "Scheduled"}</Badge>
              <button
                className="icon-button danger"
                aria-label="Delete visit"
                onClick={() => {
                  setDb((d) => ({
                    ...d,
                    visits: d.visits.filter((x) => x.id !== v.id),
                  }));
                  notify("Visit removed");
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </section>
      {open && (
        <Modal title="Schedule a field visit" close={() => setOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setDb((d) => ({
                ...d,
                visits: [
                  ...d.visits,
                  {
                    id: uid(),
                    farmer: String(f.get("farmer")),
                    date: String(f.get("date")),
                    note: String(f.get("note")),
                  },
                ],
              }));
              setOpen(false);
              notify("Field visit scheduled");
            }}
          >
            <label>
              Farmer
              <select required name="farmer">
                {db.users
                  .filter((u) => u.role === "farmer")
                  .map((u) => (
                    <option key={u.id}>{u.name}</option>
                  ))}
              </select>
            </label>
            <label>
              Visit date
              <input name="date" type="date" required />
            </label>
            <label>
              Purpose and field notes
              <textarea name="note" required />
            </label>
            <button className="button primary">Save visit</button>
          </form>
        </Modal>
      )}
    </>
  );
}
