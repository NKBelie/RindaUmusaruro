import { useState } from "react";
import { ClipboardList, Download } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Badge, Modal, Empty } from "../../components/common/UI";
import { uid } from "../../services/mock";
import type { Report } from "../../types";
export default function Reports() {
  const { db, setDb, user, t, notify } = useApp();
  const [filter, setFilter] = useState("All reports");
  const [selected, setSelected] = useState<Report | null>(null);
  const [advice, setAdvice] = useState("");
  const [query, setQuery] = useState("");
  const officer = user?.role !== "farmer";
  const list = db.reports.filter(
    (r) =>
      (filter === "All reports" || r.status === filter) &&
      (r.issue + " " + r.crop).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        title={t(officer ? "Crop Reports" : "Reports")}
        subtitle={
          officer
            ? "Review crop concerns and help farmers take their next step."
            : "Your observations, assessments, and extension officer advice in one place."
        }
        action={
          <button
            className="button secondary"
            onClick={() => {
              const blob = new Blob([JSON.stringify(db.reports, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "rinda-crop-reports.json";
              a.click();
              URL.revokeObjectURL(url);
              notify("Report history exported");
            }}
          >
            <Download size={17} />
            Export records
          </button>
        }
      />
      <div className="toolbar panel">
        <input
          aria-label="Search reports"
          placeholder="Search crop or concern…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Report status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["All reports", "Open", "Resolved"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <section className="panel padded">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("Farm & crop")}</th>
                <th>Reported concern</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>
                      {db.farms.find((f) => f.id === r.farmId)?.name ||
                        "Removed farm"}
                    </strong>
                    <small className="block">{r.crop}</small>
                  </td>
                  <td>{r.issue}</td>
                  <td>{r.date}</td>
                  <td>
                    <Badge tone={r.status === "Open" ? "amber" : "green"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td>
                    <button
                      className="button secondary"
                      onClick={() => {
                        setSelected(r);
                        setAdvice(r.advice || "");
                      }}
                    >
                      {officer ? "Review case" : "View report"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && <Empty text="No crop reports match your search." />}
      </section>
      {selected && (
        <Modal title={selected.issue} close={() => setSelected(null)}>
          <Badge tone={selected.status === "Open" ? "amber" : "green"}>
            {selected.status}
          </Badge>
          <p>
            {selected.crop} · {selected.date}
          </p>
          {selected.image && (
            <img
              className="report-image"
              src={selected.image}
              alt="Farmer uploaded crop"
            />
          )}
          <p>{selected.note}</p>
          <p className="form-hint">
            Demo records and assessments are not an AI diagnosis.
          </p>
          {officer ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDb((d) => ({
                  ...d,
                  reports: d.reports.map((r) =>
                    r.id === selected.id
                      ? { ...r, advice, status: "Resolved" }
                      : r,
                  ),
                  notices: [
                    {
                      id: uid(),
                      title: "Your extension officer has replied",
                      body: `${selected.crop}: ${advice}`,
                      category: "Extension Officer Responses",
                      read: false,
                    },
                    ...d.notices,
                  ],
                }));
                setSelected(null);
                notify("Advice sent, case resolved, and farmer notified.");
              }}
            >
              <label>
                Your advice
                <textarea
                  required
                  minLength={10}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Add practical next steps and a field follow-up if needed…"
                />
              </label>
              <button className="button primary">
                <ClipboardList size={17} />
                Send advice & resolve
              </button>
            </form>
          ) : (
            <div className="notice green">
              <p>
                <strong>Extension officer advice</strong>
                <br />
                {selected.advice ||
                  "Your report is waiting for review. Sign in to the officer demo to continue this workflow."}
              </p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
