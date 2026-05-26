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
import { createUserProfile, getUserProfile, updateUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/types/firebaseTypes";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    const p = await getUserProfile(uid);
    setProfile(p);
    return p;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.uid);
  }, [user, fetchProfile]);

  useEffect(() => {
    const auth = getFirebaseAuth();
    void setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        void fetchProfile(nextUser.uid).then((p) => {
          if (!p) {
            void createUserProfile(
              nextUser.uid,
              nextUser.email ?? "",
              nextUser.displayName,
              nextUser.photoURL,
            ).then(() => fetchProfile(nextUser.uid));
          } else if (nextUser.photoURL && nextUser.photoURL !== p.photoURL) {
            // Sync updated Google profile picture to Firestore
            void updateUserProfile(nextUser.uid, { photoURL: nextUser.photoURL })
              .then(() => fetchProfile(nextUser.uid));
          }
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const signOutUser = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
    const { isNewUser } = getAdditionalUserInfo(credential) ?? {};
    if (isNewUser) {
      await createUserProfile(
        credential.user.uid,
        credential.user.email ?? "",
        credential.user.displayName,
        credential.user.photoURL,
      );
    } else if (credential.user.photoURL) {
      // Always sync the latest Google profile picture on sign-in —
      // onAuthStateChanged uses a cached user so it may not reflect recent changes.
      await updateUserProfile(credential.user.uid, { photoURL: credential.user.photoURL });
    }
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile, signOutUser, signInWithGoogle }),
    [user, profile, loading, refreshProfile, signOutUser, signInWithGoogle],
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
