import { useState } from "react";
import { BookOpen, Search, ArrowUpRight, Plus } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Heading, Badge, Modal, Empty } from "../../components/common/UI";
import { articles } from "../../data/demo";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { photos } from "../../data/demo";
export default function Advice() {
  const { lang, t, user, notify } = useApp();
  const [items, setItems] = useLocalStorage("rinda-articles", articles);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [selected, setSelected] = useState<string[] | null>(null);
  const [add, setAdd] = useState(false);
  return (
    <>
      <Heading
        title={t("Agricultural Advice")}
        subtitle={t(
          "Practical knowledge. Confident decisions. One growing season at a time.",
        )}
        action={
          user?.role === "admin" ? (
            <button
              className="button primary"
              onClick={() => {
                setSelected(null);
                setAdd(true);
              }}
            >
              <Plus size={17} />
              Add article
            </button>
          ) : (
            <Badge>Learning together</Badge>
          )
        }
      />
      <div
        className="advice-banner"
        style={{
          backgroundImage: `linear-gradient(90deg,#163f2c, #163f2cb0),url(${photos.hills})`,
        }}
      >
        <BookOpen size={42} />
        <div>
          <span className="eyebrow">A LITTLE KNOWLEDGE GOES A LONG WAY</span>
          <h2>
            Grow your knowledge.
            <br />
            Grow your potential.
          </h2>
          <p>
            General demonstration content. Consult an extension officer for
            local guidance.
          </p>
        </div>
      </div>
      <div className="toolbar panel spaced">
        <label className="search-input">
          <Search size={18} />
          <input
            aria-label="Search advice"
            placeholder={t("Search farming advice…")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Advisory category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["All topics", ...new Set(items.map((a) => a[1]))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="article-grid">
        {items
          .filter(
            (a) =>
              a.join(" ").toLowerCase().includes(query.toLowerCase()) &&
              (category === "All topics" || a[1] === category),
          )
          .map((a, i) => (
            <article className="panel article-card" key={a[0]}>
              <div className={"article-top tone-" + (i % 3)}>
                <BookOpen size={30} />
                <Badge tone="neutral">Demo guide</Badge>
              </div>
              <div className="padded">
                <span className="eyebrow">{a[1]}</span>
                <h2>{lang === "rw" ? a[4] : a[0]}</h2>
                <p className="muted">{lang === "rw" ? a[4] : a[3]}</p>
                <div className="row between">
                  <small>{a[2]} · 29 Oct 2026</small>
                  <button
                    className="icon-button"
                    aria-label={"Read " + a[0]}
                    onClick={() => setSelected(a)}
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
                {user?.role === "admin" && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setSelected(a);
                      setAdd(true);
                    }}
                  >
                    Edit article
                  </button>
                )}
                {user?.role === "admin" && (
                  <button
                    className="text-button danger"
                    onClick={() => {
                      setItems(items.filter((v) => v[0] !== a[0]));
                      notify("Article removed");
                    }}
                  >
                    Remove article
                  </button>
                )}
              </div>
            </article>
          ))}
      </div>
      {!items.length && (
        <Empty text="Your knowledge center is ready for its first article." />
      )}
      {selected && !add && (
        <Modal
          title={lang === "rw" ? selected[4] : selected[0]}
          close={() => setSelected(null)}
        >
          <Badge>Demo educational content</Badge>
          <p>
            {selected[1]} · {selected[2]}
          </p>
          <h3>Recommended action</h3>
          <p>{lang === "rw" ? selected[4] : selected[3]}</p>
          <p className="notice green">
            Discuss your field conditions with an agricultural extension
            officer. This content is a prototype example, not an official
            agricultural recommendation.
          </p>
          <small>
            Published 29 October 2026 · Source: demonstration content
          </small>
        </Modal>
      )}
      {add && (
        <Modal
          title="Add advisory article"
          close={() => {
            setAdd(false);
            setSelected(null);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setItems([
                ...items.filter((a) => a[0] !== selected?.[0]),
                [
                  String(f.get("title")),
                  String(f.get("category")),
                  String(f.get("crop")),
                  String(f.get("action")),
                  String(f.get("rw")),
                ],
              ]);
              setAdd(false);
              setSelected(null);
              notify("Advisory article published in demo library");
            }}
          >
            {[
              ["title", "Article title"],
              ["category", "Category"],
              ["crop", "Crop category"],
              ["action", "Description and recommended action"],
              ["rw", "Kinyarwanda content"],
            ].map(([name, label]) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  required
                  defaultValue={
                    selected?.[
                      ["title", "category", "crop", "action", "rw"].indexOf(
                        name,
                      )
                    ] || ""
                  }
                />
              </label>
            ))}
            <p className="muted">
              New articles are labeled as demonstration content.
            </p>
            <button className="button primary">Publish demo article</button>
          </form>
        </Modal>
      )}
    </>
  );
}
