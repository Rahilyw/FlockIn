import { Link, Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirebaseAuth } from "@/firebase/app";
import { signupSchema, type SignupFormValues } from "@/lib/authSchemas";
import { mapAuthError } from "@/lib/authErrors";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AuthBoardLayout } from "@/components/auth/AuthBoardLayout";

const FlockInWordmark = () => (
  <div
    className="font-black leading-none"
    style={{ fontFamily: "Montserrat, sans-serif", fontSize: 34, letterSpacing: "-0.01em" }}
  >
    <span style={{ color: "#2A6FC8" }}>F</span>
    <span style={{ color: "#2A6FC8" }}>l</span>
    <span style={{ color: "#E89B3C" }}>o</span>
    <span style={{ color: "#0F3D5C" }}>c</span>
    <span style={{ color: "#2A6FC8" }}>k</span>
    <span style={{ color: "#1F8A6E" }}>I</span>
    <span style={{ color: "#E89B3C" }}>n</span>
    <span style={{ color: "#C95D36" }}>!</span>
    <span style={{ color: "#2A6FC8" }}>!</span>
  </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      fontFamily: "Montserrat, sans-serif",
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: "0.14em",
      textTransform: "uppercase" as const,
      color: "#8a7c79",
    }}
  >
    {children}
  </span>
);

const Signup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        values.email,
        values.password,
      );
      await sendEmailVerification(credential.user);
      toast.success("Account created. Check your inbox to verify your email.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(mapAuthError(error));
    }
  };

  return (
    <AuthBoardLayout>
      <div
        className="relative w-full max-w-sm"
        style={{ transform: "rotate(-1deg)" }}
      >
        {/* Pushpin */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #fff59d 0%, transparent 55%), #FFB300",
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 3px 7px rgba(0,0,0,0.55), inset 0 -1px 2px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        />

        {/* Card */}
        <div
          style={{
            background: "#FFFEF8",
            borderRadius: 16,
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.30), 0 6px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center pt-10 pb-5 px-8">
            <img
              src="/flockin-peacock-pixel.jpeg"
              alt="FlockIn!! logo"
              style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 10 }}
            />
            <FlockInWordmark />
            <h1
              className="font-black mt-4 mb-1"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 20,
                color: "#1B1C19",
                letterSpacing: "-0.01em",
              }}
            >
              Join the flock.
            </h1>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                color: "#8a7c79",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Sign up to discover what's pinned around campus.
            </p>
          </div>

          {/* Form body */}
          <div className="px-8 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel asChild><FieldLabel>Email</FieldLabel></FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="h-10 bg-white text-sm"
                          style={{ borderColor: "#E4E0D9" }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel asChild><FieldLabel>Password</FieldLabel></FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          placeholder="At least 8 characters"
                          className="h-10 bg-white text-sm"
                          style={{ borderColor: "#E4E0D9" }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel asChild><FieldLabel>Confirm Password</FieldLabel></FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          className="h-10 bg-white text-sm"
                          style={{ borderColor: "#E4E0D9" }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full transition-all active:scale-95"
                    style={{
                      height: 48,
                      background: "#C95D36",
                      color: "#FFF",
                      border: "none",
                      borderRadius: 10,
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: form.formState.isSubmitting ? "not-allowed" : "pointer",
                      opacity: form.formState.isSubmitting ? 0.7 : 1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {form.formState.isSubmitting ? "Creating account…" : "Post me to the board →"}
                  </button>
                </div>
              </form>
            </Form>

            <p
              className="text-center mt-4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 10.5,
                color: "#a09290",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              By signing up you agree to FlockIn!!'s{" "}
              <a href="#" style={{ color: "#1B1C19", textDecoration: "underline" }}>Terms</a>
              {" "}&amp;{" "}
              <a href="#" style={{ color: "#1B1C19", textDecoration: "underline" }}>Privacy</a>.
            </p>
          </div>

          {/* Footer */}
          <div
            className="flex flex-col items-center gap-2 py-5 px-8"
            style={{ borderTop: "1px solid #F0EDE8" }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: "#8a7c79",
                fontWeight: 500,
              }}
            >
              Already on the board?
            </p>
            <Link
              to="/login"
              className="transition-colors"
              style={{
                padding: "6px 20px",
                borderRadius: 999,
                border: "1.5px solid rgba(201,93,54,0.4)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
                color: "#C95D36",
                textDecoration: "none",
              }}
            >
              ← Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthBoardLayout>
  );
};

export default Signup;
