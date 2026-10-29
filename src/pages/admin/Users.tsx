import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Modal, Badge, Empty } from "../../components/common/UI";
import type { User, Role } from "../../types";
import { uid } from "../../services/mock";
export default function Users() {
  const { db, setDb, user, notify, t } = useApp();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All roles");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<User | null>(null);
  const [remove, setRemove] = useState<User | null>(null);
  const admin = user?.role === "admin";
  const list = db.users.filter(
    (u) =>
      (admin || u.role === "farmer") &&
      (role === "All roles" || u.role === role) &&
      (u.name + " " + u.district + " " + u.phone)
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        title={t(admin ? "User Management" : "Farmer directory")}
        subtitle="Fictional demonstration accounts and regional contacts."
        action={
          admin && (
            <button
              className="button primary"
              onClick={() =>
                setEdit({
                  id: "",
                  name: "",
                  phone: "",
                  email: "",
                  district: "Rwamagana",
                  role: "farmer",
                })
              }
            >
              <Plus size={17} />
              Add user
            </button>
          )
        }
      />
      <div className="toolbar panel">
        <label className="search-input">
          <Search size={18} />
          <input
            aria-label="Search users"
            value={query}
            placeholder="Search name, district, or phone…"
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
        {admin && (
          <select
            aria-label="Filter user role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            {["All roles", "farmer", "officer", "admin"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        )}
      </div>
      <section className="panel padded">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>District</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.slice((page - 1) * 6, page * 6).map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                    <small className="block">
                      {u.email || "No email provided"}
                    </small>
                  </td>
                  <td>
                    <Badge>{u.role}</Badge>
                  </td>
                  <td>{u.district}</td>
                  <td>{u.phone}</td>
                  <td>
                    <div className="row">
                      <button
                        className="icon-button"
                        aria-label={"Edit " + u.name}
                        onClick={() => setEdit({ ...u })}
                      >
                        <Pencil size={16} />
                      </button>
                      {admin && u.id !== user?.id && (
                        <button
                          className="icon-button danger"
                          aria-label={"Remove " + u.name}
                          onClick={() => setRemove(u)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && <Empty text="No users found." />}
        <div className="pagination">
          <span>{list.length} demonstration accounts</span>
          <button
            className="button secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>{page}</span>
          <button
            className="button secondary"
            disabled={page * 6 >= list.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>
      {edit && (
        <Modal
          title={
            admin ? (edit.id ? "Edit user" : "Add user") : "Farmer details"
          }
          close={() => setEdit(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDb((d) => ({
                ...d,
                users: edit.id
                  ? d.users.map((u) => (u.id === edit.id ? edit : u))
                  : [...d.users, { ...edit, id: uid() }],
              }));
              setEdit(null);
              notify("User details saved");
            }}
          >
            {(["name", "phone", "email", "district"] as const).map((k) => (
              <label key={k}>
                {k}
                <input
                  required={k !== "email"}
                  type={k === "email" ? "email" : "text"}
                  value={edit[k]}
                  onChange={(e) => setEdit({ ...edit, [k]: e.target.value })}
                  readOnly={!admin}
                />
              </label>
            ))}
            {admin && (
              <label>
                Role
                <select
                  value={edit.role}
                  onChange={(e) =>
                    setEdit({ ...edit, role: e.target.value as Role })
                  }
                >
                  {["farmer", "officer", "admin"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
            )}
            {admin && <button className="button primary">Save user</button>}
          </form>
        </Modal>
      )}
      {remove && (
        <Modal
          title={"Remove " + remove.name + "?"}
          close={() => setRemove(null)}
        >
          <p>Remove this fictional account from the local demo directory?</p>
          <button
            className="button danger-button"
            onClick={() => {
              setDb((d) => ({
                ...d,
                users: d.users.filter((u) => u.id !== remove.id),
              }));
              setRemove(null);
              notify("User removed");
            }}
          >
            Remove account
          </button>
        </Modal>
      )}
    </>
  );
}
