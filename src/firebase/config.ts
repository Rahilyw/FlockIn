import type { FirebaseOptions } from "firebase/app";

/**
 * Keys that must be present for the web app to initialize Firebase.
 * `measurementId` is optional (Analytics only).
 */
const REQUIRED_ENV_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

/**
 * Builds the `firebaseConfig` object from Vite environment variables.
 * Lives in its own file so you can test or swap config sources later without
 * touching initialization logic.
 */
export function getFirebaseConfig(): FirebaseOptions {
  const missing = REQUIRED_ENV_KEYS.filter((key) => {
    const value = import.meta.env[key as keyof ImportMetaEnv];
    return typeof value !== "string" || value.trim() === "";
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase env: ${missing.join(", ")}. Create .env.local from .env.example.`,
    );
  }

  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    ...(measurementId && measurementId.trim() !== ""
      ? { measurementId: measurementId.trim() }
      : {}),
  };
}
