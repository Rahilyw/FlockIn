import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Check, Clock, Flag, ShieldCheck, Tag, User, X, MapPin, ArrowLeft, AlertCircle, MessageSquare, ExternalLink } from "lucide-react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  approveEvent,
  clearEventReport,
  getPendingEvents,
  getRecentlyReviewedEvents,
  getReportedEvents,
  rejectEvent,
} from "@/lib/firestore";
import type { Event } from "@/types/firebaseTypes";
import type { Timestamp } from "firebase/firestore";

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID as string | undefined;

const pendingEventsKey = ["admin", "pending-events"] as const;
const reportedEventsKey = ["admin", "reported-events"] as const;
const reviewedEventsKey = ["admin", "recently-reviewed-events"] as const;

type AdminTab = "pending" | "reported" | "reviewed";

function formatDateTime(start?: Timestamp, end?: Timestamp) {
  const startDate = start?.toDate?.();
  const endDate = end?.toDate?.();

  if (!startDate) return "Date TBD";

  const date = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = endDate?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return endTime ? `${date}, ${startTime} to ${endTime}` : `${date}, ${startTime}`;
}

function isPdfUrl(url: string): boolean {
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

const GRADIENT_PALETTE = [
  "linear-gradient(160deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)",
  "linear-gradient(160deg, #134e4a 0%, #0ea5e9 60%, #67e8f9 100%)",
  "linear-gradient(160deg, #166534 0%, #84cc16 60%, #fde68a 100%)",
  "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 55%, #ec4899 100%)",
  "linear-gradient(160deg, #7f1d1d 0%, #f97316 55%, #fde68a 100%)",
  "linear-gradient(160deg, #0c4a6e 0%, #0ea5e9 55%, #a7f3d0 100%)",
  "linear-gradient(160deg, #4a044e 0%, #d946ef 55%, #f0abfc 100%)",
  "linear-gradient(160deg, #1c1917 0%, #d97706 55%, #fef3c7 100%)",
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function AdminEventSummaryCard({
  event,
  isSelected,
  onClick,
  mode,
}: {
  event: Event;
  isSelected: boolean;
  onClick: () => void;
  mode: AdminTab;
}) {
  const fallbackGradient = GRADIENT_PALETTE[hashId(event.id) % GRADIENT_PALETTE.length];
  const posterPath = event.imagePath ?? event.posterUrl ?? null;
  const isPosterPdf = posterPath ? isPdfUrl(posterPath) : false;

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-4 p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
        isSelected
          ? "bg-white border-primary/50 shadow-md translate-x-1"
          : "bg-white/60 hover:bg-white border-border/40 shadow-sm hover:shadow-md hover:translate-x-0.5"
      }`}
    >
      <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-inner border border-black/5 relative">
        {posterPath && !isPosterPdf ? (
          <img src={posterPath} alt={event.title} className="w-full h-full object-cover" />
        ) : posterPath && isPosterPdf ? (
          <div className="w-full h-full flex items-center justify-center bg-muted text-destructive">
            <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
          </div>
        ) : (
          <div className="w-full h-full" style={{ background: fallbackGradient }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider">
            {event.category}
          </Badge>
          {mode === "reviewed" && (
            <Badge
              className={`px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider ${
                event.status === "approved"
                  ? "bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/10"
                  : "bg-muted text-muted-foreground hover:bg-muted"
              }`}
            >
              {event.status === "approved" ? "Approved" : "Rejected"}
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-[14px] leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-[12px] text-muted-foreground mt-1 truncate">{event.creatorName}</p>
        <p className="text-[11px] text-muted-foreground/80 mt-0.5 truncate">
          {formatDateTime(event.date, event.endTime)}
        </p>
      </div>
    </div>
  );
}

function AdminEventDetailView({
  event,
  onApprove,
  onReject,
  onClearReport,
  isUpdating,
  mode,
  onZoomPoster,
}: {
  event: Event;
  onApprove: (variables: { id: string }) => void;
  onReject: (variables: { id: string; reason?: string }) => void;
  onClearReport: (variables: { id: string }) => void;
  isUpdating: boolean;
  mode: AdminTab;
  onZoomPoster: (path: string) => void;
}) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setIsRejecting(false);
    setReason("");
  }, [event.id]);

  const fallbackGradient = GRADIENT_PALETTE[hashId(event.id) % GRADIENT_PALETTE.length];
  const posterPath = event.imagePath ?? event.posterUrl ?? null;
  const isPosterPdf = posterPath ? isPdfUrl(posterPath) : false;

  const handleSubmitRejection = () => {
    onReject({ id: event.id, reason: reason.trim() });
    setIsRejecting(false);
  };

  return (
    <Card className="border-border/60 bg-white/95 shadow-md rounded-3xl overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="relative w-full bg-slate-950 flex items-center justify-center border-b border-border/50 h-[340px] overflow-hidden cursor-zoom-in group/poster"
          onClick={() => posterPath && !isPosterPdf && onZoomPoster(posterPath)}
        >
          {posterPath && !isPosterPdf ? (
            <>
              {/* Blurred background framing */}
              <img src={posterPath} alt="" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35" />
              <img 
                src={posterPath} 
                alt={event.title} 
                className="relative max-h-full max-w-full object-contain transition-transform duration-300 group-hover/poster:scale-[1.02]" 
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 duration-200">
                <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  Click to see full poster
                </span>
              </div>
            </>
          ) : posterPath && isPosterPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="material-symbols-outlined text-[48px] text-destructive">picture_as_pdf</span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">PDF Poster Uploaded</p>
              <a
                href={posterPath}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-primary hover:underline"
              >
                Open PDF Poster <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: fallbackGradient }}>
              <div className="text-center text-white/90 p-6 drop-shadow-md">
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Poster Fallback</p>
                <p className="font-extrabold text-2xl line-clamp-2 mt-1">{event.title}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-bold uppercase tracking-wider text-[10px]">
                {event.category}
              </Badge>
              {mode === "reported" && (
                <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 font-bold uppercase tracking-wider text-[10px]">
                  Reported Event
                </Badge>
              )}
              {event.status === "rejected" && (
                <Badge className="bg-muted text-muted-foreground hover:bg-muted font-bold uppercase tracking-wider text-[10px]">
                  Rejected
                </Badge>
              )}
            </div>

            <h2 className="text-2xl font-black text-foreground tracking-tight leading-tight">
              {event.title}
            </h2>
          </div>

          <div className="grid gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 text-sm">
            <div className="flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">Date & Time</p>
                <p className="text-muted-foreground text-xs">{formatDateTime(event.date, event.endTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">Location</p>
                <p className="text-muted-foreground text-xs">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <User className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">Organizer</p>
                <p className="text-muted-foreground text-xs">{event.creatorName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">About the Event</h4>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line max-w-prose">
              {event.description}
            </p>
          </div>

          {(event.tags ?? []).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {(event.tags ?? []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {event.status === "rejected" && event.rejectionReason && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 text-sm space-y-1">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Previous Rejection Reason</p>
              <p className="text-amber-950 font-medium">{event.rejectionReason}</p>
            </div>
          )}

          <div className="border-t border-border/40 pt-6">
            {isRejecting ? (
              <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-4">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <label htmlFor="rejection-reason" className="block text-xs font-black uppercase tracking-wider text-destructive">
                      Reason for Rejection
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      This will be shown to the creator on their dashboard so they know what to update.
                    </p>
                  </div>
                </div>

                <textarea
                  id="rejection-reason"
                  className="w-full min-h-[90px] p-3 rounded-xl border border-border/80 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  placeholder="e.g., Please upload a higher resolution poster image, the text on this one is hard to read..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="rounded-full px-4 h-9 text-xs font-semibold"
                    onClick={() => setIsRejecting(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 h-9 text-xs font-bold"
                    disabled={isUpdating}
                    onClick={handleSubmitRejection}
                  >
                    Send Rejection Reason
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 items-center">
                {mode !== "reviewed" && (
                  <Button
                    className="flex-1 min-h-12 bg-[#E07A5F] px-6 text-white hover:bg-[#cf684d] rounded-2xl font-bold flex items-center justify-center gap-2"
                    disabled={isUpdating}
                    onClick={() => onApprove({ id: event.id })}
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                    {mode === "reported" ? "Keep Event" : "Approve Event"}
                  </Button>
                )}

                {mode === "reported" && (
                  <Button
                    variant="outline"
                    className="flex-1 min-h-12 border-border/80 bg-background px-6 text-foreground hover:bg-muted rounded-2xl font-semibold flex items-center justify-center gap-2"
                    disabled={isUpdating}
                    onClick={() => onClearReport({ id: event.id })}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Clear Report
                  </Button>
                )}

                {mode !== "reviewed" && (
                  <Button
                    variant="outline"
                    className="flex-1 min-h-12 border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5 text-destructive bg-background px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
                    disabled={isUpdating}
                    onClick={() => setIsRejecting(true)}
                  >
                    <X className="h-4 w-4 stroke-[3]" />
                    {mode === "reported" ? "Remove Event" : "Reject Event"}
                  </Button>
                )}

                {mode === "reviewed" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground italic w-full justify-center py-2">
                    <AlertCircle className="h-4 w-4" />
                    This event has already been reviewed.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function useEventStatusMutation(status: "approved" | "rejected") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      status === "approved" ? approveEvent(id) : rejectEvent(id, reason),
    onMutate: async ({ id }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: pendingEventsKey }),
        queryClient.cancelQueries({ queryKey: reportedEventsKey }),
      ]);
      const previousPending = queryClient.getQueryData<Event[]>(pendingEventsKey) ?? [];
      const previousReported = queryClient.getQueryData<Event[]>(reportedEventsKey) ?? [];
      queryClient.setQueryData<Event[]>(
        pendingEventsKey,
        previousPending.filter((event) => event.id !== id),
      );
      queryClient.setQueryData<Event[]>(
        reportedEventsKey,
        previousReported.filter((event) => event.id !== id),
      );
      return { previousPending, previousReported };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(pendingEventsKey, context?.previousPending ?? []);
      queryClient.setQueryData(reportedEventsKey, context?.previousReported ?? []);
      toast.error(`Couldn't ${status === "approved" ? "approve" : "reject"} the event.`);
    },
    onSuccess: () => {
      toast.success(status === "approved" ? "Event approved." : "Event rejected.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pendingEventsKey });
      queryClient.invalidateQueries({ queryKey: reportedEventsKey });
      queryClient.invalidateQueries({ queryKey: reviewedEventsKey });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

function useClearReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => clearEventReport(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: reportedEventsKey });
      const previousReported = queryClient.getQueryData<Event[]>(reportedEventsKey) ?? [];
      queryClient.setQueryData<Event[]>(
        reportedEventsKey,
        previousReported.filter((event) => event.id !== id),
      );
      return { previousReported };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(reportedEventsKey, context?.previousReported ?? []);
      toast.error("Couldn't clear the report.");
    },
    onSuccess: () => {
      toast.success("Report cleared.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reportedEventsKey });
      queryClient.invalidateQueries({ queryKey: reviewedEventsKey });
    },
  });
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>("pending");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: pendingEvents = [], isLoading: pendingLoading, isError: pendingError } = useQuery({
    queryKey: pendingEventsKey,
    queryFn: getPendingEvents,
    staleTime: 1000 * 30,
  });
  const { data: reportedEvents = [], isLoading: reportedLoading, isError: reportedError } = useQuery({
    queryKey: reportedEventsKey,
    queryFn: getReportedEvents,
    staleTime: 1000 * 30,
  });
  const { data: reviewedEvents = [], isLoading: reviewedLoading, isError: reviewedError } = useQuery({
    queryKey: reviewedEventsKey,
    queryFn: getRecentlyReviewedEvents,
    staleTime: 1000 * 30,
  });

  const approveMutation = useEventStatusMutation("approved");
  const rejectMutation = useEventStatusMutation("rejected");
  const clearReportMutation = useClearReportMutation();

  const tabConfig: Array<{
    id: AdminTab;
    label: string;
    count: number;
    icon: React.ReactNode;
  }> = [
    { id: "pending", label: "Pending review", count: pendingEvents.length, icon: <Clock className="h-4 w-4" /> },
    { id: "reported", label: "Reported events", count: reportedEvents.length, icon: <Flag className="h-4 w-4" /> },
    { id: "reviewed", label: "Recent approvals", count: reviewedEvents.length, icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  const visibleEvents =
    activeTab === "reported" ? reportedEvents :
    activeTab === "reviewed" ? reviewedEvents :
    pendingEvents;
  const isLoading =
    activeTab === "reported" ? reportedLoading :
    activeTab === "reviewed" ? reviewedLoading :
    pendingLoading;
  const isError =
    activeTab === "reported" ? reportedError :
    activeTab === "reviewed" ? reviewedError :
    pendingError;

  const activeSelectedEvent = visibleEvents.find(e => e.id === selectedEventId) || visibleEvents[0] || null;

  useEffect(() => {
    setSelectedEventId(null);
  }, [activeTab]);

  const emptyCopy =
    activeTab === "reported"
      ? "No reported events need review."
      : activeTab === "reviewed"
        ? "No approvals or rejections yet."
        : "No pending events. You're all caught up!";

  const isUpdating = approveMutation.isPending || rejectMutation.isPending || clearReportMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {activeTab === "reviewed" ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Newest reviewed first
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  Review queue
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black text-primary tracking-tight">Admin Queue</h1>
              <Badge className="rounded-full bg-[#E07A5F] px-3 py-1 text-sm text-white hover:bg-[#E07A5F] font-bold">
                {pendingEvents.length} pending
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {tabConfig.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm"
                style={active ? {
                  background: "oklch(44% 0.14 25)",
                  color: "oklch(97% 0.01 25)",
                  boxShadow: "0 4px 14px oklch(44% 0.14 25 / 0.28)",
                } : {
                  background: "rgba(255,255,255,0.72)",
                  color: "oklch(40% 0.08 30)",
                  boxShadow: "0 1px 5px oklch(50% 0.05 30 / 0.12)",
                }}
                aria-pressed={active}
              >
                {tab.icon}
                {tab.label}
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-black"
                  style={active
                    ? { background: "rgba(255,255,255,.24)", color: "inherit" }
                    : { background: "oklch(44% 0.14 25 / 0.12)", color: "oklch(44% 0.14 25)" }
                  }
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border-border/60">
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-border/60">
              <CardContent className="p-8 space-y-6">
                <Skeleton className="w-full aspect-[16/9] rounded-2xl" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          </div>
        ) : isError ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-sm text-destructive font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Could not load this queue. Check the Firestore query and try again.
            </CardContent>
          </Card>
        ) : visibleEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-16 text-center shadow-inner">
            <p className="text-lg font-bold text-foreground">
              {emptyCopy}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
            <div className={`space-y-3 lg:block ${selectedEventId && activeSelectedEvent ? "hidden" : "block"}`}>
              <div className="text-xs font-black uppercase tracking-wider text-muted-foreground/60 mb-2 px-1">
                Queue ({visibleEvents.length} items)
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                {visibleEvents.map((event) => (
                  <AdminEventSummaryCard
                    key={event.id}
                    event={event}
                    isSelected={activeSelectedEvent?.id === event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    mode={activeTab}
                  />
                ))}
              </div>
            </div>

            <div className={`lg:block lg:sticky lg:top-24 ${activeSelectedEvent ? "block" : "hidden"}`}>
              <div className="lg:hidden mb-4">
                <Button
                  variant="ghost"
                  className="rounded-full px-4 text-xs font-bold text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedEventId(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Queue
                </Button>
              </div>

              {activeSelectedEvent && (
                <AdminEventDetailView
                  event={activeSelectedEvent}
                  onApprove={approveMutation.mutate}
                  onReject={rejectMutation.mutate}
                  onClearReport={clearReportMutation.mutate}
                  isUpdating={isUpdating}
                  mode={activeTab}
                  onZoomPoster={setLightboxImage}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal for Zooming Poster */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out animate-lightbox-fade"
          onClick={() => setLightboxImage(null)}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-lightbox-fade {
              animation: fadeIn 0.2s ease-out forwards;
            }
            .animate-lightbox-scale {
              animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          <button 
            className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10 shadow-lg active:scale-95 cursor-pointer"
            onClick={() => setLightboxImage(null)}
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
          
          <img 
            src={lightboxImage} 
            alt="Full size poster preview" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10 animate-lightbox-scale cursor-default" 
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image itself
          />
          
          <a
            href={lightboxImage}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-6 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in new tab
          </a>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return null;

  if (user && !ADMIN_UID) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-3">
          <p className="font-bold text-lg">Admin not configured</p>
          <p className="text-muted-foreground text-sm">
            Add this to <code className="bg-muted px-1 rounded">.env.local</code> then restart the dev server:
          </p>
          <code className="block bg-muted rounded-xl px-4 py-3 text-sm font-mono select-all break-all">
            VITE_ADMIN_UID={user.uid}
          </code>
        </div>
      </div>
    );
  }

  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }

  return <AdminContent />;
}
