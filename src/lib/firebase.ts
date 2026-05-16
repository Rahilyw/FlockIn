/**
 * Single import point for all Firebase service getters.
 * Feature code imports from here instead of reaching into src/firebase/.
 *
 * Usage:
 *   import { getFirebaseAuth, getFirebaseDb, getFirebaseStorage } from "@/lib/firebase";
 */
export {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseDb,
  getFirebaseStorage,
  getGoogleProvider,
  initFirebaseAnalytics,
} from "@/firebase/app";
