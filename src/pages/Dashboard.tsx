import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { ClubCard } from "@/components/ClubCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEventsByIds } from "@/hooks/useEventsByIds";
import { useClubsByIds } from "@/hooks/useClubsByIds";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";

function EmptyState({ message, linkTo, linkLabel }: { message: string; linkTo: string; linkLabel: string }) {
  const navigate = useNavigate();
  return (
    <div className="text-center py-16 space-y-4">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={() => navigate(linkTo)}>{linkLabel}</Button>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { savedEvents, savedClubs, toggleEvent, toggleClub } = useBookmarks();

  const joinedEventIds = profile?.joinedEvents ?? [];
  const joinedClubIds = profile?.joinedClubs ?? [];

  const { data: joinedEvents = [], isLoading: loadingJoinedEvents } = useEventsByIds(joinedEventIds);
  const { data: joinedClubs = [], isLoading: loadingJoinedClubs } = useClubsByIds(joinedClubIds);
  const { data: savedEventsList = [], isLoading: loadingSavedEvents } = useEventsByIds(savedEvents);
  const { data: savedClubsList = [], isLoading: loadingSavedClubs } = useClubsByIds(savedClubs);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">
            My Space
          </h1>
          <p className="text-muted-foreground text-lg">
            Everything you've joined and saved, in one place.
          </p>
        </div>

        <Tabs defaultValue="joined-events">
          <TabsList className="mb-8">
            <TabsTrigger value="joined-events">
              Joined Events
              {joinedEventIds.length > 0 && (
                <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {joinedEventIds.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="joined-clubs">
              Joined Clubs
              {joinedClubIds.length > 0 && (
                <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {joinedClubIds.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved-events">
              Saved Events
              {savedEvents.length > 0 && (
                <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {savedEvents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved-clubs">
              Saved Clubs
              {savedClubs.length > 0 && (
                <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {savedClubs.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="joined-events">
            {loadingJoinedEvents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : joinedEvents.length === 0 ? (
              <EmptyState
                message="You haven't joined any events yet."
                linkTo="/events"
                linkLabel="Browse Events"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {joinedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBookmarked={savedEvents.includes(event.id)}
                    onBookmark={toggleEvent}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="joined-clubs">
            {loadingJoinedClubs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : joinedClubs.length === 0 ? (
              <EmptyState
                message="You haven't joined any clubs yet."
                linkTo="/clubs"
                linkLabel="Browse Clubs"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    isBookmarked={savedClubs.includes(club.id)}
                    onBookmark={toggleClub}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved-events">
            {loadingSavedEvents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : savedEventsList.length === 0 ? (
              <EmptyState
                message="You haven't saved any events yet. Hit the bookmark icon on any event."
                linkTo="/events"
                linkLabel="Browse Events"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedEventsList.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBookmarked={savedEvents.includes(event.id)}
                    onBookmark={toggleEvent}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved-clubs">
            {loadingSavedClubs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : savedClubsList.length === 0 ? (
              <EmptyState
                message="You haven't saved any clubs yet. Hit the bookmark icon on any club."
                linkTo="/clubs"
                linkLabel="Browse Clubs"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedClubsList.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    isBookmarked={savedClubs.includes(club.id)}
                    onBookmark={toggleClub}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
