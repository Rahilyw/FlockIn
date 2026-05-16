import type { AuthError } from "firebase/auth";

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as AuthError).code === "string"
  );
}

/**
 * Turns Firebase `auth/...` error codes into short messages for toasts and forms.
 * See: https://firebase.google.com/docs/auth/admin/errors
 */
export function mapAuthError(error: unknown): string {
  if (!isAuthError(error)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "That email address does not look valid.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled for this project.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in cancelled.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Allow pop-ups and try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    case "auth/credential-already-in-use":
      return "This credential is already linked to another account.";
    default:
      return error.message || "Authentication failed.";
  }
}
