import { useNavigate } from "react-router-dom";
import { Bookmark, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Club } from "@/types/firebaseTypes";

interface Props {
  club: Club;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}

export function ClubCard({ club, isBookmarked = false, onBookmark }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer hover:shadow-elevated transition-[transform,box-shadow] duration-300 hover:-translate-y-1 bg-gradient-card border-border/50"
      onClick={() => navigate(`/clubs/${club.id}`)}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={club.name}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                {club.name[0]}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                {club.name}
              </h3>
              <Badge variant="outline" className="text-xs mt-1">{club.category}</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(club.id);
            }}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">{club.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{club.memberCount} members</span>
        </div>
        {club.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {club.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
