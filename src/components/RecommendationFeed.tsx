import { ArrowRight, Calendar, Compass, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendations } from "@/hooks/queries/useRecommendations";
import type { RecommendationKind } from "@/lib/schemas";

function listItemIcon(kind: RecommendationKind) {
  switch (kind) {
    case "Event":
      return <Calendar className="h-4 w-4 text-primary" />;
    case "Club":
      return <Sparkles className="h-4 w-4 text-secondary" />;
    case "Resource":
      return <Compass className="h-4 w-4 text-accent" />;
  }
}

const RecommendationFeed = () => {
  const { data, isPending, isError, error, refetch, isFetching } = useRecommendations();

  if (isError) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Could not load recommendations."}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (isPending || !data) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-48 rounded-full" />
                <Skeleton className="h-10 w-full max-w-lg" />
                <Skeleton className="h-20 w-full max-w-2xl" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-12 w-44" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] xl:grid-cols-[1.4fr_1fr]">
              <Skeleton className="min-h-[320px] rounded-xl" />
              <div className="grid gap-6">
                <Skeleton className="min-h-[200px] rounded-xl" />
                <Skeleton className="min-h-[200px] rounded-xl" />
                <Skeleton className="min-h-[200px] rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { topPick, listItems } = data;

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-sm font-medium text-primary ring-1 ring-primary/10">
                <Sparkles className="h-4 w-4" />
                Recommended for you
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Personalized campus recommendations
              </h2>
              <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                Discover events, student groups, and resources selected to fit your interests and recent activity.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="h-12 px-5">
                See all recommendations
              </Button>
              <Button
                className="h-12 px-5 bg-gradient-primary hover:opacity-90"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                Refresh feed
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.55fr_1fr] xl:grid-cols-[1.4fr_1fr]">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
                      Top pick
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                      {topPick.title}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {topPick.badgeLabel}
                  </Badge>
                </div>

                <p className="mt-6 max-w-xl text-base text-slate-600">{topPick.summary}</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <Calendar className="h-4 w-4 text-primary" />
                      {topPick.dateRange}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{topPick.venue}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <Users className="h-4 w-4 text-secondary" />
                      {topPick.attendeesHeadline}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{topPick.attendeesSubtext}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Save this event
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-6">
              {listItems.map((item) => (
                <Card key={item.title} className="overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3 text-slate-700">
                        {listItemIcon(item.kind)}
                        <span className="text-sm font-medium">{item.kind}</span>
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">
                        {item.category}
                      </Badge>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                    <div className="mt-5 text-sm text-slate-500">{item.detail}</div>
                    <div className="mt-4 text-sm text-slate-500">{item.meta}</div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button variant="ghost" className="w-full justify-between text-slate-900 hover:bg-slate-100">
                      {item.actionLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationFeed;
