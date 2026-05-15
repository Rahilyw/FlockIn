import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirebaseConfig } from "@/firebase/config";

/**
 * Single Firebase app instance for the whole SPA.
 * `getApps()[0]` returns an existing app if hot reload re-runs this module.
 */
let firebaseApp: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }
  if (!firebaseApp) {
    firebaseApp = initializeApp(getFirebaseConfig());
  }
  return firebaseApp;
}

/** Lazily created Auth instance bound to the app above. */
let firebaseAuth: Auth | undefined;

export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }
  return firebaseAuth;
}

/**
 * Analytics only runs in the browser and only when supported.
 * Loaded dynamically so the main bundle stays smaller when Analytics is unused.
 */
export function initFirebaseAnalytics(): void {
  if (typeof window === "undefined") {
    return;
  }
  void import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    void isSupported().then((supported) => {
      if (supported) {
        getAnalytics(getFirebaseApp());
      }
    });
  });
}
