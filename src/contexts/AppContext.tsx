import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { seed } from "../data/demo";
import { rw } from "../locales";
import type { Store, User } from "../types";
const Context = createContext<ReturnType<typeof useAppState> | null>(null);
function useAppState() {
  const [db, setDb] = useLocalStorage<Store>("rinda-data-v1", seed);
  const [user, setUser] = useLocalStorage<User | null>("rinda-user", null);
  const [lang, setLang] = useLocalStorage("rinda-lang", "en");
  const [toast, setToast] = useState("");
  useEffect(() => {
    document.documentElement.lang = lang;
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, lang]);
  return {
    db,
    setDb,
    user,
    setUser,
    lang,
    setLang,
    t: (s: string) => (lang === "rw" ? rw[s] || s : s),
    toast,
    notify: setToast,
  };
}
export function AppProvider({ children }: { children: ReactNode }) {
  const app = useAppState();
  return (
    <Context.Provider value={app}>
      {children}
      {app.toast && (
        <div className="toast" role="status">
          ✓ {app.toast}
        </div>
      )}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw Error("AppProvider required");
  return value;
}
