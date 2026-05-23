import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Calendar, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useEventDetail } from "@/hooks/useEventDetail";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { joinEvent, leaveEvent } from "@/lib/firestore";
import { toast } from "@/components/ui/sonner";
import type { Timestamp } from "firebase/firestore";

function formatDate(ts: Timestamp) {
  return ts?.toDate?.()?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) ?? "TBD";
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading } = useEventDetail(id!);
  const { savedEvents, toggleEvent } = useBookmarks();
  const { user, profile, refreshProfile } = useAuth();
  const [joining, setJoining] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: deleteEventMutation, isPending: isDeleting } = useDeleteEvent({
    eventId: id!,
    userId: user?.uid ?? "",
  });

  const isAttending = profile?.joinedEvents?.includes(id!) ?? false;
  const isBookmarked = savedEvents.includes(id!);
  const isOrganizer = event?.creatorId === user?.uid;

  const handleJoinLeave = async () => {
    if (!user) { navigate("/login"); return; }
    setJoining(true);
    try {
      if (isAttending) {
        await leaveEvent(id!, user.uid);
      } else {
        await joinEvent(id!, user.uid);
      }
      await refreshProfile();
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventMutation();
      toast.success("Event deleted successfully.");
      navigate("/events");
    } catch (error) {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[3/4] overflow-hidden rounded-xl">
            {event.imagePath ? (
              <img src={event.imagePath} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground text-6xl font-bold opacity-40">
                  {event.title[0]}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{event.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground">by {event.creatorName}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-primary shrink-0" />
                <span>{event.rsvpCount} attending</span>
              </div>
            </div>

            <p className="text-foreground leading-relaxed">{event.description}</p>

            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-gradient-primary hover:opacity-90"
                onClick={handleJoinLeave}
                disabled={joining}
              >
                {joining ? "..." : isAttending ? "Leave Event" : "Join Event"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleEvent(event.id)}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>

              {isOrganizer && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/events/${id}/edit`)}
                    title="Edit event"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {showDeleteDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-2">Delete Event?</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    This action cannot be undone. All attendees will be removed from this event.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
