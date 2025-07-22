import { Calendar, Users, BookOpen, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventCard from "./EventCard";
import ClubCard from "./ClubCard";
import ResourceCard from "./ResourceCard";

const FeaturedSection = () => {
  const featuredEvents = [
    {
      title: "Tech Innovation Symposium",
      description: "Join leading industry experts as they discuss the latest trends in technology and innovation. Network with professionals and discover new opportunities.",
      date: "March 15, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Engineering Auditorium",
      attendees: 245,
      category: "Technology"
    },
    {
      title: "Spring Career Fair",
      description: "Connect with 50+ employers from various industries. Bring your resume and discover internship and full-time opportunities.",
      date: "March 18, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Student Union Ballroom",
      attendees: 1200,
      category: "Career"
    },
    {
      title: "Cultural Festival",
      description: "Celebrate diversity with food, music, and performances from cultures around the world. Free admission and food tastings.",
      date: "March 22, 2024",
      time: "6:00 PM - 10:00 PM",
      location: "Campus Quad",
      attendees: 800,
      category: "Cultural"
    }
  ];

  const featuredClubs = [
    {
      name: "Robotics Club",
      description: "Build robots, compete in competitions, and learn cutting-edge technology. All skill levels welcome!",
      category: "STEM",
      members: 156,
      rating: 4.8,
      tags: ["Robotics", "Engineering", "Competitions", "Arduino"]
    },
    {
      name: "Photography Society",
      description: "Capture campus life, learn new techniques, and showcase your work in our monthly exhibitions.",
      category: "Arts",
      members: 89,
      rating: 4.6,
      tags: ["Photography", "Digital Art", "Exhibitions", "Nature"]
    },
    {
      name: "Environmental Action Group",
      description: "Work together to make our campus more sustainable and raise environmental awareness in the community.",
      category: "Service",
      members: 203,
      rating: 4.9,
      tags: ["Sustainability", "Environment", "Community", "Activism"]
    }
  ];

  const campusResources = [
    {
      title: "Academic Success Center",
      description: "Get tutoring, study skills workshops, and academic coaching to help you succeed in your courses.",
      category: "Academic",
      location: "Library 2nd Floor",
      hours: "Mon-Fri 8AM-8PM",
      contact: "(555) 123-4567",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Counseling & Wellness",
      description: "Mental health support, stress management resources, and wellness programs for student well-being.",
      category: "Wellness",
      location: "Health Center",
      hours: "Mon-Fri 9AM-5PM",
      contact: "(555) 123-4568",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Career Services",
      description: "Resume reviews, interview prep, job search assistance, and career planning guidance.",
      category: "Career",
      location: "Student Services Building",
      hours: "Mon-Fri 8AM-6PM",
      contact: "(555) 123-4569",
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Events Section */}
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
            {featuredEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Events
            </Button>
          </div>
        </section>

        {/* Clubs Section */}
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
            {featuredClubs.map((club, index) => (
              <ClubCard key={index} {...club} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Browse All Clubs
            </Button>
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Campus Resources
              </h2>
              <p className="text-muted-foreground">
                Access support services and facilities
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
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