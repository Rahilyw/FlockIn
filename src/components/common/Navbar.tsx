import { Search, Calendar, Users, BookOpen, Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { mapAuthError } from "@/lib/authErrors";
import flockInLogo from "@/assets/FlockIn-login.png";

/**
 * App shell navigation (aligned with `Header`).
 * Uses `FlockIn-login.png` for the brand mark instead of a letter placeholder.
 */
const Navbar = () => {
  const { user, loading, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success("Signed out.");
      navigate("/");
    } catch (error) {
      toast.error(mapAuthError(error));
    }
  };

  const mobileNav = (
    <>
      <DropdownMenuItem asChild>
        <Link to="/#events">Events</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/#clubs">Clubs</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/posters">Posters</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/#resources">Resources</Link>
      </DropdownMenuItem>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={flockInLogo}
              alt="FlockIn"
              className="h-8 w-auto max-h-8 object-contain object-left"
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FlockIn!!
            </span>
          </Link>

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

          <div className="hidden sm:flex flex-1 max-w-md mx-4 min-w-0">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search events, clubs, resources..." className="pl-10 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {mobileNav}
                {!loading && !user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/login">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup">Get started</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {!loading && user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="truncate font-normal text-muted-foreground text-xs">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted hidden md:block" aria-hidden />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 max-w-[220px] hidden md:flex">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" className="hidden md:flex" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="hidden md:flex bg-gradient-primary hover:opacity-90" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="sm:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events, clubs, resources..." className="pl-10 w-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
