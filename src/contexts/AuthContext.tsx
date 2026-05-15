import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/firebase/app";

type AuthContextValue = {
  /** Current Firebase user, or null when signed out */
  user: User | null;
  /** True until the first `onAuthStateChanged` callback runs */
  loading: boolean;
  /** Signs the user out and clears local persistence */
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Wrap your routed app with this provider so any component can call `useAuth()`.
 * It subscribes once to Firebase auth state and keeps `user` / `loading` in sync.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    // Keep sessions across browser tabs / restarts (default, but set explicitly for clarity)
    void setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signOutUser,
    }),
    [user, loading, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return ctx;
}
