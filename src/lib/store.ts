import { useEffect, useSyncExternalStore } from "react";
import { createClient, type User as SupabaseUser } from "@supabase/supabase-js";

const configuredSupabaseUrl = import.meta.env["VITE_SUPABASE_URL"]?.trim();
const supabaseUrl = configuredSupabaseUrl ? new URL(configuredSupabaseUrl).origin : undefined;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"]?.trim();
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

const EMPTY: string[] = [];

function createMemoryStore<T>(initial: T) {
  let value = initial;
  const subscribers = new Set<() => void>();
  return {
    get: () => value,
    set: (next: T) => {
      value = next;
      subscribers.forEach((subscriber) => subscriber());
    },
    subscribe: (subscriber: () => void) => {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  };
}

function createLocalStore<T>(key: string, initial: T) {
  let value = initial;
  let loaded = false;
  const store = createMemoryStore(initial);
  const load = () => {
    if (loaded || typeof window === "undefined") return value;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      value = initial;
    }
    store.set(value);
    return value;
  };
  return {
    get: () => (loaded ? store.get() : load()),
    set: (next: T) => {
      value = next;
      loaded = true;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Favorites remain available for the current session if storage is unavailable.
        }
      }
      store.set(next);
    },
    subscribe: store.subscribe,
  };
}

export type User = { id: string; name: string; email: string; avatarUrl?: string };
type AuthSnapshot = { user: User | null; ready: boolean; recoverySession: boolean };

const EMPTY_AUTH_SNAPSHOT: AuthSnapshot = {
  user: null,
  ready: false,
  recoverySession: false,
};
const authStore = createMemoryStore<AuthSnapshot>(EMPTY_AUTH_SNAPSHOT);
const favoritesStore = createMemoryStore<string[]>(EMPTY);
const guestFavoritesStore = createLocalStore<string[]>("hb-favorites", []);
let authInitialization: Promise<void> | null = null;
let favoritesOwner: string | null = null;
let favoritesRevision = 0;

function mapUser(user: SupabaseUser | null): User | null {
  if (!user) return null;
  const fullName = user.user_metadata["full_name"] ?? user.user_metadata["name"];
  const avatarUrl = user.user_metadata["avatar_url"] ?? user.user_metadata["picture"];
  return {
    id: user.id,
    name: typeof fullName === "string" ? fullName : user.email?.split("@")[0] ?? "HomeBase member",
    email: user.email ?? "",
    avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined,
  };
}

function setGuestFavorites() {
  favoritesRevision++;
  favoritesOwner = null;
  favoritesStore.set(guestFavoritesStore.get());
}

async function syncAccountFavorites(userId: string) {
  if (!supabase) return;
  const revision = ++favoritesRevision;
  const guestFavorites = guestFavoritesStore.get();
  const visibleFavorites = favoritesOwner === userId ? favoritesStore.get() : guestFavorites;
  favoritesOwner = userId;

  const { data, error } = await supabase
    .from("user_favorites")
    .select("listing_id")
    .eq("user_id", userId);

  if (error) {
    favoritesStore.set([...new Set([...visibleFavorites, ...guestFavorites])]);
    return;
  }

  const remoteFavorites = (data ?? []).map((row) => row.listing_id as string);
  const mergedFavorites = [...new Set([...remoteFavorites, ...guestFavorites, ...visibleFavorites])];
  const favoritesToAdd = mergedFavorites
    .filter((listingId) => !remoteFavorites.includes(listingId))
    .map((listingId) => ({ user_id: userId, listing_id: listingId }));

  if (favoritesToAdd.length) {
    const { error: saveError } = await supabase
      .from("user_favorites")
      .upsert(favoritesToAdd, { onConflict: "user_id,listing_id", ignoreDuplicates: true });
    if (saveError) {
      favoritesStore.set(mergedFavorites);
      return;
    }
  }

  if (revision !== favoritesRevision || authStore.get().user?.id !== userId) return;
  favoritesStore.set(mergedFavorites);
  guestFavoritesStore.set([]);
}

function applySession(user: User | null, recoverySession = false) {
  authStore.set({ user, ready: true, recoverySession });
  if (!user) {
    setGuestFavorites();
    return;
  }
  if (favoritesOwner !== user.id) {
    favoritesStore.set(guestFavoritesStore.get());
    void syncAccountFavorites(user.id);
  }
}

function initializeAuth() {
  if (authInitialization) return authInitialization;
  authInitialization = (async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("hb-accounts");
      window.localStorage.removeItem("hb-session");
    }

    if (!supabase) {
      authStore.set({ user: null, ready: true, recoverySession: false });
      setGuestFavorites();
      return;
    }

    supabase.auth.onAuthStateChange((event, session) => {
      const user = mapUser(session?.user ?? null);
      queueMicrotask(() => applySession(user, event === "PASSWORD_RECOVERY"));
    });

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      authStore.set({ user: null, ready: true, recoverySession: false });
      setGuestFavorites();
      return;
    }
    applySession(mapUser(data.session?.user ?? null));
  })().catch((error: unknown) => {
    console.error("Could not initialize account session", error);
    authStore.set({ user: null, ready: true, recoverySession: false });
    setGuestFavorites();
  });
  return authInitialization;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Account services are not configured yet. Add the Supabase URL and anon key, then restart the app.");
  }
  return supabase;
}

export async function toggleFavorite(listingId: string) {
  const previous = favoritesStore.get();
  const saving = !previous.includes(listingId);
  const next = saving ? [...previous, listingId] : previous.filter((id) => id !== listingId);
  const user = authStore.get().user;
  favoritesStore.set(next);

  if (!user) {
    guestFavoritesStore.set(next);
    return saving;
  }

  const client = requireSupabase();
  const result = saving
    ? await client.from("user_favorites").upsert(
        [{ user_id: user.id, listing_id: listingId }],
        { onConflict: "user_id,listing_id", ignoreDuplicates: true },
      )
    : await client.from("user_favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);

  if (result.error) {
    favoritesStore.set(previous);
    throw result.error;
  }
  return saving;
}

export function useFavorites() {
  useAuth();
  const favorites = useSyncExternalStore(favoritesStore.subscribe, favoritesStore.get, () => EMPTY);
  return {
    favorites,
    isSaved: (listingId: string) => favorites.includes(listingId),
    toggle: toggleFavorite,
  };
}

export function useAuth() {
  const snapshot = useSyncExternalStore(authStore.subscribe, authStore.get, () => EMPTY_AUTH_SNAPSHOT);

  useEffect(() => {
    void initializeAuth();
  }, []);

  return {
    ...snapshot,
    isConfigured: isSupabaseConfigured,
    async signUp(name: string, email: string, password: string) {
      const client = requireSupabase();
      const { data, error } = await client.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });
      if (error) throw error;
      if (!data.session || !data.user) {
        throw new Error("Email confirmation is enabled in Supabase. Turn off Authentication > Providers > Email > Confirm email to create accounts and sign in immediately.");
      }
      applySession(mapUser(data.user));
      await syncAccountFavorites(data.user.id);
    },
    async signIn(email: string, password: string) {
      const client = requireSupabase();
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      applySession(mapUser(data.user));
      await syncAccountFavorites(data.user.id);
    },
    async signInWithGoogle() {
      const client = requireSupabase();
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    },
    async signInWithX() {
      const client = requireSupabase();
      const { error } = await client.auth.signInWithOAuth({
        provider: "x",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    },
    async signOut() {
      const client = requireSupabase();
      const { error } = await client.auth.signOut();
      if (error) throw error;
      applySession(null);
    },
    async sendPasswordReset(email: string) {
      const client = requireSupabase();
      const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
    async updatePassword(password: string) {
      const client = requireSupabase();
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      authStore.set({ ...authStore.get(), recoverySession: false });
    },
  };
}
