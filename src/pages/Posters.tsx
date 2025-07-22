import { useState } from "react";
import { Search, Filter, Grid, List, Heart, Calendar, MapPin, Users, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface Poster {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  rsvpCount: number;
  tags: string[];
  isLiked: boolean;
}

const Posters = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);

  const posters: Poster[] = [
    {
      id: "1",
      title: "Tech Innovation Summit 2024",
      description: "Join us for an exciting day of technological breakthroughs, keynote speakers from Silicon Valley, and networking opportunities with industry leaders. Discover the future of AI, blockchain, and sustainable tech.",
      imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600&h=800&fit=crop",
      category: "Technology",
      organizer: "Computer Science Club",
      date: "March 25, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Engineering Building Auditorium",
      capacity: 300,
      rsvpCount: 187,
      tags: ["AI", "Blockchain", "Networking", "Innovation"],
      isLiked: false
    },
    {
      id: "2",
      title: "Spring Music Festival",
      description: "Experience an unforgettable evening of live music featuring local bands, student performers, and special guest artists. Food trucks, art installations, and interactive experiences await!",
      imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=800&fit=crop",
      category: "Arts & Culture",
      organizer: "Music Society",
      date: "April 2, 2024",
      time: "6:00 PM - 11:00 PM",
      location: "Campus Quad",
      capacity: 1000,
      rsvpCount: 645,
      tags: ["Live Music", "Festival", "Food", "Art"],
      isLiked: true
    },
    {
      id: "3",
      title: "Environmental Action Workshop",
      description: "Learn practical ways to make a difference in environmental conservation. Hands-on workshops on composting, sustainable living, and climate action strategies.",
      imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=800&fit=crop",
      category: "Environment",
      organizer: "Green Campus Initiative",
      date: "March 30, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Science Building Room 101",
      capacity: 50,
      rsvpCount: 23,
      tags: ["Sustainability", "Workshop", "Climate", "Action"],
      isLiked: false
    },
    {
      id: "4",
      title: "Career Networking Night",
      description: "Connect with alumni, industry professionals, and potential employers. Resume reviews, mock interviews, and valuable career advice from successful graduates.",
      imageUrl: "https://images.unsplash.com/photo-1494891848038-79d202a2afeb?w=600&h=800&fit=crop",
      category: "Career",
      organizer: "Career Services",
      date: "April 5, 2024",
      time: "6:30 PM - 9:00 PM",
      location: "Student Union Ballroom",
      capacity: 200,
      rsvpCount: 156,
      tags: ["Networking", "Career", "Alumni", "Professional"],
      isLiked: false
    },
    {
      id: "5",
      title: "Stargazing Night",
      description: "Explore the wonders of the night sky with our astronomy club. Telescopes provided, hot chocolate included. Perfect for beginners and astronomy enthusiasts alike.",
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&h=800&fit=crop",
      category: "Science",
      organizer: "Astronomy Club",
      date: "April 8, 2024",
      time: "8:00 PM - 11:00 PM",
      location: "Observatory Rooftop",
      capacity: 30,
      rsvpCount: 18,
      tags: ["Astronomy", "Stargazing", "Science", "Night"],
      isLiked: true
    }
  ];

  const categories = ["all", "Technology", "Arts & Culture", "Environment", "Career", "Science"];

  const filteredPosters = posters.filter(poster => {
    const matchesSearch = poster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poster.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poster.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || poster.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRSVP = (poster: Poster) => {
    toast({
      title: "RSVP Successful!",
      description: `You've successfully registered for ${poster.title}. Check your email for confirmation details.`,
    });
  };

  const toggleLike = (posterId: string) => {
    // In a real app, this would update the database
    toast({
      title: "Added to favorites!",
      description: "This event has been saved to your favorites.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Event Posters
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover upcoming events through beautiful digital posters
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, organizers, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredPosters.length} of {posters.length} events
          </p>
        </div>

        {/* Posters Grid/List */}
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }`}>
          {filteredPosters.map((poster) => (
            <Dialog key={poster.id}>
              <DialogTrigger asChild>
                <Card className="group cursor-pointer hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
                  <CardContent className="p-0">
                    {viewMode === "grid" ? (
                      // Grid View
                      <div>
                        <div className="aspect-[3/4] overflow-hidden rounded-t-lg relative">
                          <img 
                            src={poster.imageUrl} 
                            alt={poster.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(poster.id);
                              }}
                            >
                              <Heart className={`h-4 w-4 ${poster.isLiked ? 'fill-current text-red-500' : ''}`} />
                            </Button>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-primary/90 text-primary-foreground">
                              {poster.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {poster.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            by {poster.organizer}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{poster.date}</span>
                            <span>{poster.rsvpCount}/{poster.capacity}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="flex gap-4 p-4">
                        <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <img 
                            src={poster.imageUrl} 
                            alt={poster.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {poster.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(poster.id);
                              }}
                            >
                              <Heart className={`h-4 w-4 ${poster.isLiked ? 'fill-current text-red-500' : ''}`} />
                            </Button>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            by {poster.organizer}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {poster.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{poster.category}</Badge>
                            <span>{poster.date}</span>
                            <span>{poster.rsvpCount}/{poster.capacity} attending</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {poster.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Poster Image */}
                  <div className="aspect-[3/4] overflow-hidden rounded-lg">
                    <img 
                      src={poster.imageUrl} 
                      alt={poster.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="space-y-6">
                    <div>
                      <Badge className="mb-3">{poster.category}</Badge>
                      <p className="text-muted-foreground mb-4">
                        Organized by <span className="font-semibold text-foreground">{poster.organizer}</span>
                      </p>
                      <p className="text-foreground leading-relaxed">
                        {poster.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{poster.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-secondary" />
                        <span>{poster.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-accent" />
                        <span>{poster.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-campus-green" />
                        <span>{poster.rsvpCount} of {poster.capacity} attending</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {poster.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        className="flex-1 bg-gradient-primary hover:opacity-90"
                        onClick={() => handleRSVP(poster)}
                      >
                        RSVP Now
                      </Button>
                      <Button variant="outline" onClick={() => toggleLike(poster.id)}>
                        <Heart className={`h-4 w-4 mr-2 ${poster.isLiked ? 'fill-current text-red-500' : ''}`} />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredPosters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No events found matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posters;