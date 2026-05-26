import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Check, Clock, Flag, ShieldCheck, Tag, User, X } from "lucide-react";
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

function AdminEventCard({
  event,
  onApprove,
  onReject,
  onClearReport,
  isUpdating,
  mode = "pending",
}: {
  event: Event;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onClearReport?: (id: string) => void;
  isUpdating: boolean;
  mode?: AdminTab;
}) {
  const primaryBadge =
    mode === "reported"
      ? { label: "Reported", className: "bg-destructive/10 text-destructive hover:bg-destructive/10" }
      : mode === "reviewed"
        ? {
            label: event.status === "approved" ? "Approved" : "Rejected",
            className: event.status === "approved"
              ? "bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/10"
              : "bg-muted text-muted-foreground hover:bg-muted",
          }
        : { label: "Pending", className: "bg-primary/10 text-primary hover:bg-primary/10" };

  return (
    <Card className="border-border/60 bg-card/95 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={primaryBadge.className}>{primaryBadge.label}</Badge>
                <Badge variant="outline" className="border-border/70 text-muted-foreground">
                  {event.category}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold leading-tight text-foreground">
                {event.title}
              </h2>
            </div>

            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="truncate">{event.creatorName}</span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDateTime(event.date, event.endTime)}</span>
              </p>
            </div>

            {(event.tags ?? []).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {(event.tags ?? []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full bg-surface-variant/50 text-xs font-medium text-on-surface-variant"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <p className="max-w-3xl text-sm leading-6 text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            {mode !== "reviewed" && onApprove && (
              <Button
                className="min-h-11 bg-[#E07A5F] px-5 text-white hover:bg-[#cf684d]"
                disabled={isUpdating}
                onClick={() => onApprove(event.id)}
              >
                <Check className="h-4 w-4" />
                {mode === "reported" ? "Keep event" : "Approve"}
              </Button>
            )}
            {mode === "reported" && onClearReport && (
              <Button
                variant="outline"
                className="min-h-11 border-border/80 bg-background px-5 text-foreground hover:bg-muted"
                disabled={isUpdating}
                onClick={() => onClearReport(event.id)}
              >
                <ShieldCheck className="h-4 w-4" />
                Clear report
              </Button>
            )}
            {mode !== "reviewed" && onReject && (
              <Button
                variant="outline"
                className="min-h-11 border-border/80 bg-background px-5 text-foreground hover:bg-muted"
                disabled={isUpdating}
                onClick={() => onReject(event.id)}
              >
                <X className="h-4 w-4" />
                {mode === "reported" ? "Remove" : "Reject"}
              </Button>
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
    mutationFn: (id: string) => (status === "approved" ? approveEvent(id) : rejectEvent(id)),
    onMutate: async (id) => {
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
    onError: (_error, _id, context) => {
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
    mutationFn: clearEventReport,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: reportedEventsKey });
      const previousReported = queryClient.getQueryData<Event[]>(reportedEventsKey) ?? [];
      queryClient.setQueryData<Event[]>(
        reportedEventsKey,
        previousReported.filter((event) => event.id !== id),
      );
      return { previousReported };
    },
    onError: (_error, _id, context) => {
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

// Inner component — all data hooks live here, runs only when auth is confirmed.
function AdminContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>("pending");
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

  const emptyCopy =
    activeTab === "reported"
      ? "No reported events need review."
      : activeTab === "reviewed"
        ? "No approvals or rejections yet."
        : "No pending events. You're all caught up!";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
              <h1 className="text-4xl font-bold text-primary">Admin Queue</h1>
              <Badge className="rounded-full bg-[#E07A5F] px-3 py-1 text-sm text-white hover:bg-[#E07A5F]">
                {pendingEvents.length} pending
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabConfig.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all hover:-translate-y-0.5"
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
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-border/60">
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-sm text-destructive">
              Could not load this queue. Check the Firestore query and try again.
            </CardContent>
          </Card>
        ) : visibleEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-foreground">
              {emptyCopy}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleEvents.map((event) => (
              <AdminEventCard
                key={event.id}
                event={event}
                isUpdating={
                  (approveMutation.isPending && approveMutation.variables === event.id) ||
                  (rejectMutation.isPending && rejectMutation.variables === event.id) ||
                  (clearReportMutation.isPending && clearReportMutation.variables === event.id)
                }
                mode={activeTab}
                onApprove={approveMutation.mutate}
                onReject={rejectMutation.mutate}
                onClearReport={clearReportMutation.mutate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return null;

  // No VITE_ADMIN_UID set yet — show config helper to the signed-in user.
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

  // Not logged in, or UID doesn't match — redirect away.
  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }

  return <AdminContent />;
}
