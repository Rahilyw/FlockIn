import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useEventDetail } from "@/hooks/useEventDetail";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";
import { joinEvent, leaveEvent } from "@/lib/firestore";
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

  const isAttending = profile?.joinedEvents?.includes(id!) ?? false;
  const isBookmarked = savedEvents.includes(id!);

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
            {event.posterUrl ? (
              <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
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
              <p className="text-muted-foreground">by {event.organizerName}</p>
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
                <span>{event.attendeeCount} attending</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
