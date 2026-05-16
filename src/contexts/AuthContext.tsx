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
  getAdditionalUserInfo,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/firebase/app";
import { createUserProfile, getUserProfile } from "@/lib/firestore";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    void setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      // Ensure a Firestore profile exists for every authenticated user.
      // This covers email/password signup, Google sign-in, and any future
      // provider — without the page components needing to know about it.
      if (nextUser) {
        void getUserProfile(nextUser.uid).then((profile) => {
          if (!profile) {
            void createUserProfile(
              nextUser.uid,
              nextUser.email ?? "",
              nextUser.displayName,
              nextUser.photoURL,
            );
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  /**
   * Opens a Google sign-in popup. If the user is new, their Firestore profile
   * is created via the onAuthStateChanged handler above.
   * Throws on error so callers can handle it (e.g. show a toast).
   */
  const signInWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
    // For new Google users, create the profile immediately rather than waiting
    // for the next onAuthStateChanged tick, so the profile exists right away.
    const { isNewUser } = getAdditionalUserInfo(credential) ?? {};
    if (isNewUser) {
      await createUserProfile(
        credential.user.uid,
        credential.user.email ?? "",
        credential.user.displayName,
        credential.user.photoURL,
      );
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signOutUser, signInWithGoogle }),
    [user, loading, signOutUser, signInWithGoogle],
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
