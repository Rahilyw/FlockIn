import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Check, Clock, Tag, User, X } from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { approveEvent, getPendingEvents, rejectEvent } from "@/lib/firestore";
import type { Event } from "@/types/firebaseTypes";
import type { Timestamp } from "firebase/firestore";

const pendingEventsKey = ["admin", "pending-events"] as const;

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
  isUpdating,
}: {
  event: Event;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isUpdating: boolean;
}) {
  return (
    <Card className="border-border/60 bg-card/95 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  Pending
                </Badge>
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
            <Button
              className="min-h-11 bg-[#E07A5F] px-5 text-white hover:bg-[#cf684d]"
              disabled={isUpdating}
              onClick={() => onApprove(event.id)}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="min-h-11 border-border/80 bg-background px-5 text-foreground hover:bg-muted"
              disabled={isUpdating}
              onClick={() => onReject(event.id)}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
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
      await queryClient.cancelQueries({ queryKey: pendingEventsKey });
      const previous = queryClient.getQueryData<Event[]>(pendingEventsKey) ?? [];
      queryClient.setQueryData<Event[]>(
        pendingEventsKey,
        previous.filter((event) => event.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(pendingEventsKey, context?.previous ?? []);
      toast.error(`Couldn't ${status === "approved" ? "approve" : "reject"} the event.`);
    },
    onSuccess: () => {
      toast.success(status === "approved" ? "Event approved." : "Event rejected.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pendingEventsKey });
    },
  });
}

export default function Admin() {
  const { data: pendingEvents = [], isLoading, isError } = useQuery({
    queryKey: pendingEventsKey,
    queryFn: getPendingEvents,
    staleTime: 1000 * 30,
  });

  const approveMutation = useEventStatusMutation("approved");
  const rejectMutation = useEventStatusMutation("rejected");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Clock className="h-3.5 w-3.5" />
              Oldest first
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-primary">Admin Queue</h1>
              <Badge className="rounded-full bg-[#E07A5F] px-3 py-1 text-sm text-white hover:bg-[#E07A5F]">
                {pendingEvents.length} pending
              </Badge>
            </div>
          </div>
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
              Could not load pending events. Check the Firestore query and try again.
            </CardContent>
          </Card>
        ) : pendingEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-foreground">
              No pending events — you're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingEvents.map((event) => (
              <AdminEventCard
                key={event.id}
                event={event}
                isUpdating={
                  (approveMutation.isPending && approveMutation.variables === event.id) ||
                  (rejectMutation.isPending && rejectMutation.variables === event.id)
                }
                onApprove={approveMutation.mutate}
                onReject={rejectMutation.mutate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
