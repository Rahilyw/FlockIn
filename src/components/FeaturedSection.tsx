import { Calendar, Users, BookOpen, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "./EventCard";
import ClubCard from "./ClubCard";
import ResourceCard from "./ResourceCard";
import { useFeaturedEvents } from "@/hooks/queries/useFeaturedEvents";
import { useFeaturedClubs } from "@/hooks/queries/useFeaturedClubs";
import { useFeaturedResources } from "@/hooks/queries/useFeaturedResources";
import type { CampusResource } from "@/lib/schemas";

function resourceIcon(resource: CampusResource) {
  switch (resource.iconKey) {
    case "bookOpen":
      return <BookOpen className="h-5 w-5" />;
    case "users":
      return <Users className="h-5 w-5" />;
    case "calendar":
      return <Calendar className="h-5 w-5" />;
  }
}

const FeaturedSection = () => {
  const eventsQuery = useFeaturedEvents();
  const clubsQuery = useFeaturedClubs();
  const resourcesQuery = useFeaturedResources();

  const isPending =
    eventsQuery.isPending || clubsQuery.isPending || resourcesQuery.isPending;
  const isError = eventsQuery.isError || clubsQuery.isError || resourcesQuery.isError;
  const error = eventsQuery.error ?? clubsQuery.error ?? resourcesQuery.error;

  if (isError) {
    return (
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTitle>Could not load featured content</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Please try again later."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isPending || !eventsQuery.data || !clubsQuery.data || !resourcesQuery.data) {
    return (
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-9 w-64" />
                  <Skeleton className="h-5 w-96 max-w-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-80 rounded-lg" />
                <Skeleton className="h-80 rounded-lg" />
                <Skeleton className="h-80 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const featuredEvents = eventsQuery.data;
  const featuredClubs = clubsQuery.data;
  const campusResources = resourcesQuery.data;

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section id="events" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Don't miss out on exciting campus activities
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Events
            </Button>
          </div>
        </section>

        <section id="clubs" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Student Organizations
              </h2>
              <p className="text-muted-foreground">
                Find your community and make lasting connections
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Club
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClubs.map((club) => (
              <ClubCard key={club.name} {...club} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Browse All Clubs
            </Button>
          </div>
        </section>

        <section id="resources">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Campus Resources
              </h2>
              <p className="text-muted-foreground">Access support services and facilities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusResources.map((resource) => (
              <ResourceCard
                key={resource.title}
                title={resource.title}
                description={resource.description}
                category={resource.category}
                location={resource.location}
                hours={resource.hours}
                contact={resource.contact}
                icon={resourceIcon(resource)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Resources
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturedSection;
