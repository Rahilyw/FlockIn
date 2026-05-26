import type { CSSProperties, ReactNode } from "react";
import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, updateCreatorPhotoOnEvents } from "@/lib/firestore";
import { uploadProfilePhoto } from "@/lib/storage";
import { INTERESTS, INTEREST_EMOJI } from "@/lib/interests";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const BIO_MAX = 200;

const CARD: CSSProperties = {
  background: "oklch(99% 0.01 30 / 0.62)",
  boxShadow: "0 1px 10px oklch(60% 0.05 30 / 0.10)",
};

// ── Per-category pill colors ───────────────────────────────────────────────────

type PillPalette = {
  selBg: string; selFg: string; selBorder: string; selShadow: string;
  idleBg: string; idleFg: string; idleBorder: string;
  labelColor: string;
};

const PALETTES = {
  coral: {
    selBg: "oklch(50% 0.19 18)",  selFg: "oklch(97% 0.01 18)",
    selBorder: "oklch(50% 0.19 18)", selShadow: "0 2px 10px oklch(50% 0.19 18 / 0.32)",
    idleBg: "oklch(96% 0.035 18)", idleFg: "oklch(42% 0.14 18)", idleBorder: "oklch(82% 0.08 18 / 0.9)",
    labelColor: "oklch(50% 0.19 18)",
  },
  amber: {
    selBg: "oklch(50% 0.17 52)",  selFg: "oklch(97% 0.01 52)",
    selBorder: "oklch(50% 0.17 52)", selShadow: "0 2px 10px oklch(50% 0.17 52 / 0.32)",
    idleBg: "oklch(96% 0.035 52)", idleFg: "oklch(42% 0.14 52)", idleBorder: "oklch(82% 0.08 52 / 0.9)",
    labelColor: "oklch(50% 0.17 52)",
  },
  green: {
    selBg: "oklch(47% 0.16 162)", selFg: "oklch(97% 0.01 162)",
    selBorder: "oklch(47% 0.16 162)", selShadow: "0 2px 10px oklch(47% 0.16 162 / 0.32)",
    idleBg: "oklch(96% 0.03 162)", idleFg: "oklch(40% 0.14 162)", idleBorder: "oklch(82% 0.07 162 / 0.9)",
    labelColor: "oklch(47% 0.16 162)",
  },
  purple: {
    selBg: "oklch(50% 0.20 300)", selFg: "oklch(97% 0.01 300)",
    selBorder: "oklch(50% 0.20 300)", selShadow: "0 2px 10px oklch(50% 0.20 300 / 0.32)",
    idleBg: "oklch(96% 0.03 300)", idleFg: "oklch(42% 0.15 300)", idleBorder: "oklch(82% 0.08 300 / 0.9)",
    labelColor: "oklch(50% 0.20 300)",
  },
  indigo: {
    selBg: "oklch(48% 0.18 265)", selFg: "oklch(97% 0.01 265)",
    selBorder: "oklch(48% 0.18 265)", selShadow: "0 2px 10px oklch(48% 0.18 265 / 0.32)",
    idleBg: "oklch(96% 0.03 265)", idleFg: "oklch(40% 0.14 265)", idleBorder: "oklch(82% 0.07 265 / 0.9)",
    labelColor: "oklch(48% 0.18 265)",
  },
  terracotta: {
    selBg: "oklch(44% 0.14 25)",  selFg: "oklch(97% 0.01 25)",
    selBorder: "oklch(44% 0.14 25)", selShadow: "0 2px 10px oklch(44% 0.14 25 / 0.32)",
    idleBg: "oklch(96% 0.03 25)",  idleFg: "oklch(40% 0.12 25)",  idleBorder: "oklch(82% 0.07 25 / 0.9)",
    labelColor: "oklch(44% 0.14 25)",
  },
} satisfies Record<string, PillPalette>;

const INTEREST_PALETTE: Record<string, keyof typeof PALETTES> = {
  Art: "coral", Music: "coral", Film: "coral", Photography: "coral", Dance: "coral", Fashion: "coral",
  Food: "amber", Cooking: "amber", Travel: "amber", Social: "amber",
  Sports: "green", Fitness: "green", Nature: "green", Volunteering: "green",
  Gaming: "purple", Literature: "purple", Science: "purple",
  Technology: "indigo", Coding: "indigo", Academic: "indigo",
  Business: "terracotta", Politics: "terracotta", Career: "terracotta", Workshop: "terracotta",
};

// ── Components ────────────────────────────────────────────────────────────────

function SectionLabel({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <p
      className="text-[10px] font-black tracking-[0.12em] uppercase"
      style={{ color: color ?? "oklch(60% 0.08 30)" }}
    >
      {children}
    </p>
  );
}

function VibePill({
  label, selected, onToggle,
}: {
  label: string; selected: boolean; onToggle: (l: string) => void;
}) {
  const palKey = INTEREST_PALETTE[label] ?? "terracotta";
  const pal = PALETTES[palKey];
  const emoji = INTEREST_EMOJI[label as keyof typeof INTEREST_EMOJI] ?? "";

  return (
    <button
      type="button"
      onClick={() => onToggle(label)}
      className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold transition-all duration-150 select-none hover:-translate-y-px active:scale-[0.97]"
      style={{
        padding: "6px 14px",
        ...(selected
          ? { background: pal.selBg, color: pal.selFg, border: `1.5px solid ${pal.selBorder}`, boxShadow: pal.selShadow }
          : { background: pal.idleBg, color: pal.idleFg, border: `1.5px solid ${pal.idleBorder}` }
        ),
      } as CSSProperties}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? user?.displayName ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhoto(user.uid, file);
      await Promise.all([
        updateUserProfile(user.uid, { photoURL: url }),
        updateCreatorPhotoOnEvents(user.uid, url),
      ]);
      await refreshProfile();
      toast({ title: "Profile picture updated!" });
    } catch {
      toast({ title: "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
      // Reset input so same file can be re-selected
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

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
        <div className="rounded-3xl p-6 backdrop-blur-sm overflow-hidden" style={CARD}>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="group relative block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ ["--tw-ring-color" as string]: PALETTES.coral.selBg }}
                aria-label="Change profile picture"
              >
                <Avatar className="h-[88px] w-[88px]">
                  <AvatarImage src={profile?.photoURL ?? user.photoURL ?? undefined} alt={displayName} />
                  <AvatarFallback
                    className="text-2xl font-extrabold"
                    style={{ background: PALETTES.terracotta.selBg, color: PALETTES.terracotta.selFg }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Ring */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ boxShadow: `0 0 0 3px ${PALETTES.coral.selBg}, 0 0 0 6px oklch(50% 0.19 18 / 0.14)` }}
                />
                {/* Camera overlay */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-150">
                  {uploadingPhoto ? (
                    <span className="material-symbols-outlined text-white text-[22px] opacity-0 group-hover:opacity-100 animate-spin transition-opacity">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-white text-[22px] opacity-0 group-hover:opacity-100 transition-opacity">photo_camera</span>
                  )}
                </div>
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-[22px] font-extrabold tracking-tight leading-tight truncate">
                {displayName || "Your Profile"}
              </h1>
              <p className="text-sm mt-0.5 truncate" style={{ color: "oklch(52% 0.06 30)" }}>
                {user.email}
              </p>
              {(savedCount > 0 || goingCount > 0) && (
                <div className="flex items-center gap-4 mt-3">
                  {savedCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: PALETTES.terracotta.selBg }}>
                      <span className="material-symbols-outlined text-[14px] leading-none">bookmark</span>
                      {savedCount} saved
                    </span>
                  )}
                  {goingCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: PALETTES.green.selBg }}>
                      <span className="material-symbols-outlined text-[14px] leading-none">celebration</span>
                      {goingCount} going
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── About you ── */}
        <section className="rounded-2xl p-5 space-y-4 backdrop-blur-sm" style={CARD}>
          <SectionLabel color={PALETTES.indigo.selBg}>About you</SectionLabel>

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-semibold" style={{ color: "oklch(32% 0.07 30)" }}>
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
              <label htmlFor="bio" className="text-sm font-semibold" style={{ color: "oklch(32% 0.07 30)" }}>
                Bio
              </label>
              <span
                className="text-xs font-medium tabular-nums transition-colors"
                style={{ color: bio.length >= BIO_MAX * 0.85 ? PALETTES.coral.selBg : "oklch(65% 0.05 30)" }}
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
        <section className="rounded-2xl p-5 space-y-3 backdrop-blur-sm" style={CARD}>
          <div className="flex items-baseline justify-between">
            <SectionLabel color={PALETTES.purple.selBg}>Your vibe</SectionLabel>
            {interests.length > 0 && (
              <span className="text-xs font-bold" style={{ color: PALETTES.amber.selBg }}>
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
            style={{
              background: PALETTES.terracotta.selBg,
              color: PALETTES.terracotta.selFg,
              boxShadow: PALETTES.terracotta.selShadow,
            }}
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-[16px] leading-none animate-spin">refresh</span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px] leading-none">check_circle</span>
                Save changes
              </>
            )}
          </button>
        </div>

      </main>
    </div>
  );
}
