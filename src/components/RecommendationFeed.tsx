import { ArrowRight, Calendar, Compass, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const recommendations = [
  {
    type: "Event",
    title: "Campus Hackathon Weekend",
    description: "A 48-hour challenge for students who love building products, meeting mentors, and launching new ideas.",
    category: "Tech",
    detail: "Starts Apr 27 · Student Innovation Lab",
    meta: "Based on your AI & startups interest",
    action: "View Event",
    icon: <Calendar className="h-4 w-4 text-primary" />
  },
  {
    type: "Club",
    title: "Design & UX Collective",
    description: "Join a creative community focused on product design, prototyping, and portfolio-building workshops.",
    category: "Design",
    detail: "120 members · Weekly meetups",
    meta: "Matches your creative activity",
    action: "Explore Club",
    icon: <Sparkles className="h-4 w-4 text-secondary" />
  },
  {
    type: "Resource",
    title: "Career Coaching Sessions",
    description: "Book one-on-one support for resume review, interview prep, and internship strategy.",
    category: "Career",
    detail: "Open slots this week · Virtual and in-person",
    meta: "Recommended from your job search history",
    action: "Book Now",
    icon: <Compass className="h-4 w-4 text-accent" />
  }
];

const RecommendationFeed = () => {
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
              <Button className="h-12 px-5 bg-gradient-primary hover:opacity-90">
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
                      Campus Hackathon Weekend
                    </h3>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    Event
                  </Badge>
                </div>

                <p className="mt-6 max-w-xl text-base text-slate-600">
                  A weekend-long experience designed for students who want to build fast, learn from mentors, and pitch new ideas. Perfect for your interest in AI and entrepreneurial projects.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <Calendar className="h-4 w-4 text-primary" />
                      April 27–29
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Student Innovation Lab</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <Users className="h-4 w-4 text-secondary" />
                      180 attendees expected
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Matches your recent event interests</p>
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
              {recommendations.map((item, index) => (
                <Card key={index} className="overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3 text-slate-700">
                        {item.icon}
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">
                        {item.category}
                      </Badge>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                    <div className="mt-5 text-sm text-slate-500">{item.detail}</div>
                    <div className="mt-4 text-sm text-slate-500">{item.meta}</div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button variant="ghost" className="w-full justify-between text-slate-900 hover:bg-slate-100">
                      {item.action}
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
