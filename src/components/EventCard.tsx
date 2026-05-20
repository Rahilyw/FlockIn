import type React from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/types/firebaseTypes";
import type { Timestamp } from "firebase/firestore";

interface Props {
  event: Event;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  style?: React.CSSProperties;
}

function formatDate(ts: Timestamp) {
  return ts?.toDate?.()?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) ?? "TBD";
}

export function EventCard({ event, isBookmarked = false, onBookmark, style }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer hover:shadow-elevated transition-[transform,box-shadow] duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 animate-card-enter"
      style={style}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] overflow-hidden rounded-t-lg relative">
          {event.posterUrl ? (
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground text-4xl font-bold opacity-40">
                {event.title[0]}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.(event.id);
              }}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-primary/90 text-primary-foreground">{event.category}</Badge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-muted-foreground text-xs">by {event.organizerName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{event.attendeeCount} attending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
