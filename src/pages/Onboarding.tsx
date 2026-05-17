import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { completeOnboarding } from "@/lib/firestore";
import { InterestSelector } from "@/components/InterestSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const MIN_INTERESTS = 3;

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    if (!user) return;
    if (interests.length < MIN_INTERESTS) {
      toast({ title: `Pick at least ${MIN_INTERESTS} interests`, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await completeOnboarding(user.uid, displayName.trim() || (user.displayName ?? ""), interests);
      await refreshProfile();
      navigate("/dashboard", { replace: true });
    } catch {
      toast({ title: "Something went wrong. Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Step {step} of 2</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {step === 1 ? "Welcome to FlockIn" : "What are you into?"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1
              ? "Let's set up your profile."
              : `Pick at least ${MIN_INTERESTS} interests so we can personalise your feed.`}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
                autoFocus
              />
            </div>
            <Button
              className="w-full"
              disabled={!displayName.trim()}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <InterestSelector selected={interests} onChange={setInterests} />
            <p className="text-sm text-muted-foreground">
              {interests.length} selected
              {interests.length < MIN_INTERESTS && ` — need ${MIN_INTERESTS - interests.length} more`}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                disabled={interests.length < MIN_INTERESTS || saving}
                onClick={handleFinish}
              >
                {saving ? "Saving…" : "Finish"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
