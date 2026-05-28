import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirebaseAuth } from "@/firebase/app";
import { signupSchema, type SignupFormValues } from "@/lib/authSchemas";
import { mapAuthError } from "@/lib/authErrors";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AuthBoardLayout } from "@/components/auth/AuthBoardLayout";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

const FlockInWordmark = () => (
  <div className="font-black leading-none" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 34, letterSpacing: "-0.01em" }}>
    <span style={{ color: "#2A6FC8" }}>F</span><span style={{ color: "#2A6FC8" }}>l</span>
    <span style={{ color: "#E89B3C" }}>o</span><span style={{ color: "#0F3D5C" }}>c</span>
    <span style={{ color: "#2A6FC8" }}>k</span><span style={{ color: "#1F8A6E" }}>I</span>
    <span style={{ color: "#E89B3C" }}>n</span><span style={{ color: "#C95D36" }}>!</span>
    <span style={{ color: "#2A6FC8" }}>!</span>
  </div>
);

const fieldStyle = {
  height: 42,
  background: "#fff",
  borderColor: "#E4E0D9",
  fontFamily: "Montserrat, sans-serif",
  fontSize: 13,
};

const Signup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  if (!authLoading && user) return <Navigate to="/" replace />;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to FlockIn!!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(), values.email, values.password,
      );
      await sendEmailVerification(credential.user);
      toast.success("Account created! Check your inbox to verify your email.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(mapAuthError(error));
    }
  };

  return (
    <AuthBoardLayout>
      <div className="relative w-full max-w-sm" style={{ transform: "rotate(-1deg)" }}>
        {/* Pushpin */}
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #fff59d 0%, transparent 55%), #FFB300",
          position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
          boxShadow: "0 3px 7px rgba(0,0,0,0.55), inset 0 -1px 2px rgba(0,0,0,0.2)", zIndex: 10,
        }} />

        {/* Card */}
        <div style={{
          background: "#FFFEF8", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.30), 0 6px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
        }}>
          {/* Header */}
          <div className="flex flex-col items-center pt-10 pb-6 px-8">
            <img src="/flockin-peacock-pixel.jpeg" alt="FlockIn!! logo"
              style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 10 }} />
            <FlockInWordmark />
            <h1 className="font-black mt-4 mb-1"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, color: "#1B1C19", letterSpacing: "-0.01em" }}>
              Join the flock.
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#8a7c79", fontWeight: 500, textAlign: "center" }}>
              Sign up to discover what's pinned around campus.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pb-6 space-y-3">
            {/* Google */}
            <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 transition-all active:scale-95"
              style={{
                height: 48, background: "#FFFFFF", border: "1.5px solid #dadce0", borderRadius: 10,
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "#1f1f1f",
                cursor: googleLoading ? "not-allowed" : "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}>
              <GoogleIcon />
              {googleLoading ? "Signing in…" : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div style={{ flex: 1, height: 1, background: "#E4E0D9" }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 800,
                color: "#c4bab8", letterSpacing: "0.12em", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#E4E0D9" }} />
            </div>

            {/* Email form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="Email"
                        className="text-sm" style={fieldStyle} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" placeholder="Password (min. 8 characters)"
                        className="text-sm" style={fieldStyle} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" placeholder="Confirm password"
                        className="text-sm" style={fieldStyle} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <button type="submit" disabled={form.formState.isSubmitting}
                  className="w-full transition-all active:scale-95"
                  style={{
                    height: 44, background: "#C95D36", color: "#FFF", border: "none", borderRadius: 10,
                    fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13,
                    cursor: form.formState.isSubmitting ? "not-allowed" : "pointer",
                    opacity: form.formState.isSubmitting ? 0.7 : 1, marginTop: 4,
                  }}>
                  {form.formState.isSubmitting ? "Creating account…" : "Post me to the board →"}
                </button>
              </form>
            </Form>

            <p style={{ textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: 10.5,
              color: "#a09290", fontWeight: 500, lineHeight: 1.5 }}>
              By signing up you agree to FlockIn!!'s{" "}
              <a href="#" style={{ color: "#1B1C19", textDecoration: "underline" }}>Terms</a>
              {" "}&amp;{" "}
              <a href="#" style={{ color: "#1B1C19", textDecoration: "underline" }}>Privacy</a>.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-2 py-5 px-8"
            style={{ borderTop: "1px solid #F0EDE8" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#8a7c79", fontWeight: 500 }}>
              Already on the board?
            </p>
            <Link to="/login" className="transition-colors" style={{
              padding: "6px 20px", borderRadius: 999, border: "1.5px solid rgba(201,93,54,0.4)",
              fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 12.5,
              color: "#C95D36", textDecoration: "none",
            }}>
              ← Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthBoardLayout>
  );
};

export default Signup;
