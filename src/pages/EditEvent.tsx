import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Tag,
  Link2,
  AlignLeft,
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
import { useUpdateEvent } from "@/hooks/useUpdateEvent";
import { useEventDetail } from "@/hooks/useEventDetail";
import {
  createEventSchema,
  EVENT_CATEGORIES,
  type CreateEventFormValues,
} from "@/lib/eventSchemas";
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
  posterUrl: string;
  date: string;
  location: string;
  category: string;
  organizerName: string;
}

function EventPreview({ title, posterUrl, date, location, category, organizerName }: PreviewProps) {
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
      {/* Portrait poster card */}
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
        {/* Background */}
        <div className="absolute inset-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900" />
          )}
          {/* Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>

        {/* Top-left: category badge */}
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

        {/* Top-right: public badge */}
        <div className="absolute top-5 right-5">
          <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Public
          </span>
        </div>

        {/* Bottom: event info */}
        <div className="absolute bottom-0 inset-x-0 p-6 text-white">
          <h2 className="text-2xl font-bold leading-tight mb-2 drop-shadow-sm">
            {title || <span className="text-white/30 font-normal">Event name</span>}
          </h2>
          {organizerName && (
            <p className="text-white/60 text-xs mb-3">by {organizerName}</p>
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: event, isLoading } = useEventDetail(id!);
  const { mutateAsync, isPending } = useUpdateEvent({ eventId: id!, userId: user?.uid ?? "" });

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      category: undefined,
      organizerName: "",
      posterUrl: "",
      tags: "",
    },
  });

  // Set form values when event loads
  useEffect(() => {
    if (event) {
      const date = event.date?.toDate?.();
      const dateString = date
        ? date.toISOString().slice(0, 16)
        : "";
      form.reset({
        title: event.title,
        description: event.description,
        date: dateString,
        location: event.location,
        category: event.category,
        organizerName: event.organizerName,
        posterUrl: event.posterUrl ?? "",
        tags: event.tags.join(", "),
      });
    }
  }, [event, form]);

  const watched = form.watch();

  const onSubmit = async (values: CreateEventFormValues) => {
    if (!user) { navigate("/login"); return; }
    if (!event) return;

    // Check ownership
    if (event.organizerId !== user.uid) {
      toast.error("You can only edit your own events.");
      return;
    }

    const tags = values.tags
      ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    try {
      await mutateAsync({
        title: values.title,
        description: values.description,
        date: Timestamp.fromDate(new Date(values.date)),
        location: values.location,
        category: values.category,
        organizerName: values.organizerName,
        posterUrl: values.posterUrl?.trim() || null,
        tags,
      });
      toast.success("Event updated!");
      navigate(`/events/${id}`);
    } catch {
      toast.error("Failed to update event. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground text-lg mb-4">Event not found.</p>
          <Button variant="outline" onClick={() => navigate("/events")}>Back to events</Button>
        </div>
      </div>
    );
  }

  if (event.organizerId !== user?.uid) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground text-lg mb-4">You can only edit your own events.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    );
  }

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
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save Changes"}
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
                    name="organizerName"
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

                  {/* Poster URL */}
                  <FormField
                    control={form.control}
                    name="posterUrl"
                    render={({ field }) => (
                      <FormItem className="m-0">
                        <FieldRow icon={<Link2 className="h-4 w-4" />}>
                          <FormControl>
                            <input
                              {...field}
                              type="url"
                              placeholder="Poster image URL (optional)"
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

                {/* Mobile save */}
                <div className="lg:hidden pt-2 pb-8">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 rounded-full"
                    disabled={isPending}
                  >
                    {isPending ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </div>

              {/* ── Right: Live Preview ── */}
              <div className="hidden lg:block">
                <EventPreview
                  title={watched.title ?? ""}
                  posterUrl={watched.posterUrl ?? ""}
                  date={watched.date ?? ""}
                  location={watched.location ?? ""}
                  category={watched.category ?? ""}
                  organizerName={watched.organizerName ?? ""}
                />
              </div>

            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
