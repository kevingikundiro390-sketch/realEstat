import { useSyncExternalStore } from "react";

// Tiny localStorage-backed store. Swap auth functions for a real backend later.
function createStore<T>(key: string, initial: T) {
  let value = initial;
  let loaded = false;
  const subs = new Set<() => void>();
  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) value = JSON.parse(raw);
    } catch {}
  };
  return {
    get: () => { load(); return value; },
    set: (v: T) => {
      value = v;
      localStorage.setItem(key, JSON.stringify(v));
      subs.forEach((s) => s());
    },
    subscribe: (cb: () => void) => { subs.add(cb); return () => subs.delete(cb); },
    initial,
  };
}

const favStore = createStore<string[]>("hb-favorites", []);
const EMPTY: string[] = [];

export function useFavorites() {
  const favs = useSyncExternalStore(favStore.subscribe, favStore.get, () => EMPTY);
  const toggle = (id: string) => {
    const cur = favStore.get();
    favStore.set(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
    return !cur.includes(id);
  };
  return { favorites: favs, isSaved: (id: string) => favs.includes(id), toggle };
}

export type User = { name: string; email: string };
type Account = User & { password: string };

const usersStore = createStore<Account[]>("hb-accounts", []);
const sessionStore = createStore<User | null>("hb-session", null);

export function useAuth() {
  const user = useSyncExternalStore(sessionStore.subscribe, sessionStore.get, () => null);
  return {
    user,
    signUp(name: string, email: string, password: string) {
      const e = email.trim().toLowerCase();
      if (usersStore.get().some((u) => u.email === e)) throw new Error("An account with this email already exists.");
      usersStore.set([...usersStore.get(), { name: name.trim(), email: e, password }]);
      sessionStore.set({ name: name.trim(), email: e });
    },
    signIn(email: string, password: string) {
      const e = email.trim().toLowerCase();
      const acc = usersStore.get().find((u) => u.email === e && u.password === password);
      if (!acc) throw new Error("Incorrect email or password.");
      sessionStore.set({ name: acc.name, email: acc.email });
    },
    signOut() { sessionStore.set(null); },
  };
}
