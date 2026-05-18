import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useClubDetail } from "@/hooks/useClubDetail";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";
import { joinClub, leaveClub } from "@/lib/firestore";

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: club, isLoading } = useClubDetail(id!);
  const { savedClubs, toggleClub } = useBookmarks();
  const { user, profile, refreshProfile } = useAuth();
  const [joining, setJoining] = useState(false);

  const isMember = profile?.joinedClubs?.includes(id!) ?? false;
  const isBookmarked = savedClubs.includes(id!);

  const handleJoinLeave = async () => {
    if (!user) { navigate("/login"); return; }
    setJoining(true);
    try {
      if (isMember) {
        await leaveClub(id!, user.uid);
      } else {
        await joinClub(id!, user.uid);
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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-48 bg-muted rounded-xl" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground text-lg mb-4">Club not found.</p>
          <Button variant="outline" onClick={() => navigate("/clubs")}>Back to clubs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <Button variant="ghost" className="mb-6 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="space-y-8">
          <div className="flex items-start gap-6">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={club.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-3xl shrink-0">
                {club.name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Badge className="mb-2">{club.category}</Badge>
              <h1 className="text-3xl font-bold mb-1">{club.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{club.memberCount} members</span>
              </div>
            </div>
          </div>

          <p className="text-foreground leading-relaxed text-base">{club.description}</p>

          {club.contactEmail && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a
                href={`mailto:${club.contactEmail}`}
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {club.contactEmail}
              </a>
            </div>
          )}

          {club.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {club.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={handleJoinLeave}
              disabled={joining}
            >
              {joining ? "..." : isMember ? "Leave Club" : "Join Club"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleClub(club.id)}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
