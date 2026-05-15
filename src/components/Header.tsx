import { Search, Calendar, Users, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import flockinLogo from "../assets/FlockIn-login.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={flockinLogo} 
              alt="FlockIn Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FlockIn!!
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#events" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </Link>
            <Link to="/#clubs" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Users className="h-4 w-4" />
              <span>Clubs</span>
            </Link>
            <Link to="/posters" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Posters</span>
            </Link>
            <Link to="/#resources" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Resources</span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, clubs, resources..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:flex">
              Sign In
            </Button>
            <Button className="hidden md:flex bg-gradient-primary hover:opacity-90">
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, clubs, resources..."
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;