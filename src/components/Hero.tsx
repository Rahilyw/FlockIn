import { Search, Calendar, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import campusHero from "@/assets/campus-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={campusHero} 
          alt="Campus scene with students" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Your Campus,{" "}
            <span className="bg-gradient-to-r from-accent to-campus-orange bg-clip-text text-transparent">
              Connected
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl animate-fade-in">
            Discover events, join clubs, and access resources all in one place. 
            Never miss what matters to your university experience.
          </p>

          {/* Search Bar */}
          <div className="mb-8 animate-slide-up">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input
                  placeholder="What are you looking for?"
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-white px-6">
                Search <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <Calendar className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-white mb-1">Events</h3>
              <p className="text-white/80 text-sm">Discover upcoming events</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <Users className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-white mb-1">Clubs</h3>
              <p className="text-white/80 text-sm">Find your community</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <BookOpen className="h-8 w-8 text-campus-green mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-white mb-1">Resources</h3>
              <p className="text-white/80 text-sm">Access campus services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-accent/20 rounded-full animate-float" />
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-campus-green/20 rounded-full animate-float" style={{animationDelay: '2s'}} />
    </section>
  );
};

export default Hero;