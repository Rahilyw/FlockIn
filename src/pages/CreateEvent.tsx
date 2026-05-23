import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import {
  ArrowLeft,
  Calendar,
  ImageIcon,
  MapPin,
  User,
  Tag,
  AlignLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import {
  createEventSchema,
  EVENT_CATEGORIES,
  type CreateEventFormValues,
} from "@/lib/eventSchemas";
import { uploadEventImage } from "@/lib/storage";
import { getUserEventCountToday } from "@/lib/firestore";
import { toast } from "@/components/ui/sonner";

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  Music: "🎵",
  Art: "🎨",
  Workshop: "🛠️",
  Social: "🎉",
  Sport: "⚽",
  Academic: "📚",
  Career: "💼",
  Food: "🍕",
  Other: "✨",
};

// ── Live Poster Preview ───────────────────────────────────────────────────────

interface PreviewProps {
  title: string;
  imageSrc: string;
  date: string;
  location: string;
  category: string;
  creatorName: string;
}

function EventPreview({ title, imageSrc, date, location, category, creatorName }: PreviewProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="sticky top-24 space-y-3">
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>

        <div className="absolute top-5 left-5">
          {category ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <span>{CATEGORY_EMOJI[category]}</span>
              {category}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/40 text-xs font-medium">
              Category
            </span>
          )}
        </div>

        <div className="absolute top-5 right-5">
          <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Public
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 text-white">
          <h2 className="text-2xl font-bold leading-tight mb-2 drop-shadow-sm">
            {title || <span className="text-white/30 font-normal">Event name</span>}
          </h2>
          {creatorName && (
            <p className="text-white/60 text-xs mb-3">by {creatorName}</p>
          )}
          <div className="space-y-1.5">
            {formattedDate && (
              <p className="flex items-center gap-2 text-sm text-white/80">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {formattedDate}
              </p>
            )}
            {location && (
              <p className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center tracking-wide">Live preview</p>
    </div>
  );
}

// ── Icon-row field ────────────────────────────────────────────────────────────

function FieldRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 group">
      <span className="mt-0.5 text-muted-foreground/60 shrink-0 group-focus-within:text-primary transition-colors">
        {icon}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ── Image upload zone ─────────────────────────────────────────────────────────

interface ImageUploadZoneProps {
  previewSrc: string;
  error: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
}

function ImageUploadZone({ previewSrc, error, onFile, onClear }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    onFile(file);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/30"
      }`}
      onClick={() => !previewSrc && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {previewSrc ? (
        <div className="relative">
          <img
            src={previewSrc}
            alt="Poster preview"
            className="w-full h-48 object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/20 rounded-2xl" />
          <button
            type="button"
            className="absolute top-3 right-3 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 hover:bg-black/80 rounded-full text-white text-xs font-medium transition-colors"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Change
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-8 px-4 text-muted-foreground">
          <ImageIcon className="h-8 w-8 opacity-40" />
          <span className="text-sm font-medium">Click to upload poster image</span>
          <span className="text-xs opacity-60">PNG, JPG, WEBP · max 5 MB</span>
        </div>
      )}

      {error && <p className="text-xs text-destructive px-4 pb-3">{error}</p>}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { mutateAsync, isPending } = useCreateEvent();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      endTime: "",
      location: "",
      category: undefined,
      creatorName: profile?.displayName ?? user?.displayName ?? "",
      tags: "",
    },
  });

  const watched = form.watch();

  const handleImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be under 5 MB.");
      return;
    }
    setImageError(null);
    setImageFile(file);
    const prev = URL.createObjectURL(file);
    setPreviewSrc((old) => { if (old) URL.revokeObjectURL(old); return prev; });
  };

  const clearImage = () => {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setImageFile(null);
    setPreviewSrc("");
    setImageError(null);
  };

  const onSubmit = async (values: CreateEventFormValues) => {
    if (!user) { navigate("/login"); return; }

    // Rate limit: max 3 events per day
    const todayCount = await getUserEventCountToday(user.uid);
    if (todayCount >= 3) {
      toast.error("You've posted 3 events today — the daily limit. Try again tomorrow!");
      return;
    }

    let imagePath: string | null = null;
    if (imageFile) {
      setIsUploading(true);
      try {
        imagePath = await uploadEventImage(user.uid, imageFile);
      } catch {
        toast.error("Image upload failed. Please try again.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const tags = values.tags
      ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    try {
      const id = await mutateAsync({
        title: values.title,
        description: values.description,
        date: Timestamp.fromDate(new Date(values.date)),
        endTime: Timestamp.fromDate(new Date(values.endTime)),
        location: values.location,
        category: values.category,
        creatorId: user.uid,
        creatorName: values.creatorName,
        creatorPhoto: user.photoURL ?? "",
        imagePath,
        tags,
      });
      toast.success("Event posted!");
      navigate(`/events/${id}`);
    } catch {
      toast.error("Failed to post event. Please try again.");
    }
  };

  const busy = isPending || isUploading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <Button variant="ghost" className="-ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gradient-primary hover:opacity-90 px-8 rounded-full"
            disabled={busy}
          >
            {isUploading ? "Uploading…" : isPending ? "Posting…" : "Publish Event"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

              {/* ── Left: Form ── */}
              <div className="space-y-6">

                {/* Inline title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Event name"
                          className="w-full text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/25 text-foreground leading-tight"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category chips */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-wrap gap-2">
                        {EVENT_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => field.onChange(field.value === cat ? undefined : cat)}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                              field.value === cat
                                ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                                : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }`}
                          >
                            <span>{CATEGORY_EMOJI[cat]}</span>
                            {cat}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image upload */}
                <ImageUploadZone
                  previewSrc={previewSrc}
                  error={imageError}
                  onFile={handleImageFile}
                  onClear={clearImage}
                />

                {/* Grouped icon-row card */}
                <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border bg-card">

                  {/* Date & time */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FieldRow icon={<Calendar className="h-4 w-4" />}>
                          <FormControl>
                            <input
                              type="datetime-local"
                              {...field}
                              className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                          </FormControl>
                        </FieldRow>
                        <FormMessage className="px-4 pb-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* End time */}
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FieldRow icon={<Calendar className="h-4 w-4" />}>
                          <FormControl>
                            <input
                              type="datetime-local"
                              {...field}
                              className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                          </FormControl>
                        </FieldRow>
                        <FormMessage className="px-4 pb-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FieldRow icon={<MapPin className="h-4 w-4" />}>
                          <FormControl>
                            <input
                              {...field}
                              placeholder="Add a location"
                              className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                          </FormControl>
                        </FieldRow>
                        <FormMessage className="px-4 pb-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Hosted by */}
                  <FormField
                    control={form.control}
                    name="creatorName"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FieldRow icon={<User className="h-4 w-4" />}>
                          <FormControl>
                            <input
                              {...field}
                              placeholder="Hosted by…"
                              className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                          </FormControl>
                        </FieldRow>
                        <FormMessage className="px-4 pb-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FieldRow icon={<Tag className="h-4 w-4" />}>
                          <FormControl>
                            <input
                              {...field}
                              placeholder="Tags — free, outdoor, all-ages…"
                              className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                          </FormControl>
                        </FieldRow>
                        <FormMessage className="px-4 pb-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FieldRow icon={<AlignLeft className="h-4 w-4" />}>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your event…"
                              className="resize-none min-h-[120px] border-none bg-transparent shadow-none p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                            />
                          </FormControl>
                        </FieldRow>
                        <FormMessage className="px-4 pb-2 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mobile publish */}
                <div className="lg:hidden pt-2 pb-8">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 rounded-full"
                    disabled={busy}
                  >
                    {isUploading ? "Uploading…" : isPending ? "Posting…" : "Publish Event"}
                  </Button>
                </div>
              </div>

              {/* ── Right: Live Preview ── */}
              <div className="hidden lg:block">
                <EventPreview
                  title={watched.title ?? ""}
                  imageSrc={previewSrc}
                  date={watched.date ?? ""}
                  location={watched.location ?? ""}
                  category={watched.category ?? ""}
                  creatorName={watched.creatorName ?? ""}
                />
              </div>

            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
