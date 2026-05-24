import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/firestore";
import { INTERESTS, INTEREST_EMOJI } from "@/lib/interests";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const TC       = "oklch(44% 0.14 25)";
const TC_FG    = "oklch(97% 0.01 25)";
const TC_GLOW  = "0 4px 16px oklch(44% 0.14 25 / 0.30)";
const BIO_MAX  = 200;

const CARD: CSSProperties = {
  background: "oklch(99% 0.01 30 / 0.62)",
  boxShadow: "0 1px 10px oklch(60% 0.05 30 / 0.10)",
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[10px] font-black tracking-[0.12em] uppercase"
      style={{ color: "oklch(60% 0.08 30)" }}
    >
      {children}
    </p>
  );
}

function VibePill({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: (l: string) => void;
}) {
  const emoji = INTEREST_EMOJI[label as keyof typeof INTEREST_EMOJI] ?? "";
  return (
    <button
      type="button"
      onClick={() => onToggle(label)}
      className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold transition-all duration-150 select-none hover:-translate-y-px active:scale-[0.97]"
      style={{
        padding: "6px 14px",
        ...(selected
          ? { background: TC, color: TC_FG, border: `1.5px solid ${TC}`, boxShadow: TC_GLOW }
          : {
              background: "oklch(99% 0.01 30)",
              color: "oklch(40% 0.08 30)",
              border: "1.5px solid oklch(86% 0.04 30 / 0.9)",
            }),
      } as CSSProperties}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(
    profile?.displayName ?? user?.displayName ?? "",
  );
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [saving, setSaving] = useState(false);

  if (!user || !profile) return null;

  const initials = (displayName || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function toggleInterest(label: string) {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim() || null,
        bio: bio.trim() || null,
        interests,
      });
      await refreshProfile();
      toast({ title: "Profile saved" });
    } catch {
      toast({ title: "Failed to save profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const savedCount = profile.savedEvents?.length ?? 0;
  const goingCount = profile.joinedEvents?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-8 space-y-4">

        {/* ── Hero card ── */}
        <div
          className="rounded-3xl p-6 backdrop-blur-sm overflow-hidden"
          style={CARD}
        >
          <div className="flex items-center gap-5">
            {/* Avatar with terracotta ring */}
            <div className="relative shrink-0">
              <Avatar className="h-[88px] w-[88px]">
                <AvatarImage src={user.photoURL ?? undefined} alt={displayName} />
                <AvatarFallback
                  className="text-2xl font-extrabold"
                  style={{ background: TC, color: TC_FG }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: `0 0 0 3px ${TC}, 0 0 0 6px oklch(44% 0.14 25 / 0.14)`,
                }}
              />
            </div>

            {/* Name + email + quick stats */}
            <div className="min-w-0 flex-1">
              <h1 className="text-[22px] font-extrabold tracking-tight leading-tight truncate">
                {displayName || "Your Profile"}
              </h1>
              <p
                className="text-sm mt-0.5 truncate"
                style={{ color: "oklch(52% 0.06 30)" }}
              >
                {user.email}
              </p>

              {(savedCount > 0 || goingCount > 0) && (
                <div className="flex items-center gap-4 mt-3">
                  {savedCount > 0 && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold"
                      style={{ color: TC }}
                    >
                      <span className="material-symbols-outlined text-[14px] leading-none">
                        bookmark
                      </span>
                      {savedCount} saved
                    </span>
                  )}
                  {goingCount > 0 && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold"
                      style={{ color: "oklch(38% 0.12 162)" }}
                    >
                      <span className="material-symbols-outlined text-[14px] leading-none">
                        celebration
                      </span>
                      {goingCount} going
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── About you ── */}
        <section
          className="rounded-2xl p-5 space-y-4 backdrop-blur-sm"
          style={CARD}
        >
          <SectionLabel>About you</SectionLabel>

          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-sm font-semibold"
              style={{ color: "oklch(32% 0.07 30)" }}
            >
              Display name
            </label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl border-0 bg-white/75 shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="bio"
                className="text-sm font-semibold"
                style={{ color: "oklch(32% 0.07 30)" }}
              >
                Bio
              </label>
              <span
                className="text-xs font-medium tabular-nums transition-colors"
                style={{
                  color:
                    bio.length >= BIO_MAX * 0.85
                      ? TC
                      : "oklch(65% 0.05 30)",
                }}
              >
                {bio.length}&thinsp;/&thinsp;{BIO_MAX}
              </span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
              placeholder="Tell people a bit about yourself…"
              rows={3}
              className="rounded-xl border-0 bg-white/75 shadow-sm resize-none"
            />
          </div>
        </section>

        {/* ── Your vibe ── */}
        <section
          className="rounded-2xl p-5 space-y-3 backdrop-blur-sm"
          style={CARD}
        >
          <div className="flex items-baseline justify-between">
            <SectionLabel>Your vibe</SectionLabel>
            {interests.length > 0 && (
              <span className="text-xs font-bold" style={{ color: TC }}>
                {interests.length} selected
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: "oklch(58% 0.05 30)" }}>
            Shapes what you discover on the noticeboard
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {INTERESTS.map((interest) => (
              <VibePill
                key={interest}
                label={interest}
                selected={interests.includes(interest)}
                onToggle={toggleInterest}
              />
            ))}
          </div>
        </section>

        {/* ── Save ── */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
            style={{ background: TC, color: TC_FG, boxShadow: TC_GLOW }}
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-[16px] leading-none animate-spin">
                  refresh
                </span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px] leading-none">
                  check_circle
                </span>
                Save changes
              </>
            )}
          </button>
        </div>

      </main>
    </div>
  );
}
