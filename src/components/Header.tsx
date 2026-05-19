import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { mapAuthError } from "@/lib/authErrors";

const NAV_LINKS = [
  { label: "Discover", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Clubs", to: "/clubs" },
  { label: "Resources", to: "/resources" },
  {label: "My Space", to: "/dashboard" },
];

const Header = () => {
  const { user, profile, loading, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success("Signed out.");
      navigate("/");
    } catch (error) {
      toast.error(mapAuthError(error));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex justify-between items-center px-gutter py-4 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm">
      {/* Logo + Nav */}
      <div className="flex items-center gap-8">
        <Link to="/" className="font-bold text-2xl tracking-tight text-primary">
          FlockIn!!
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, to }) => {
            const isActive = location.pathname === to || (to === "/" && location.pathname === "/");
            return (
              <Link
                key={label}
                to={to}
                className={`text-base font-medium transition-colors ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-2">
        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <Input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              placeholder="Search events..."
              className="h-9 w-48 sm:w-64"
            />
            <button
              type="button"
              className="p-2 hover:bg-surface-variant/40 rounded-full transition-all"
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            >
              <span className="material-symbols-outlined text-primary">close</span>
            </button>
          </form>
        ) : (
          <button
            className="p-2 hover:bg-surface-variant/40 rounded-full transition-all active:scale-90"
            onClick={() => setSearchOpen(true)}
          >
            <span className="material-symbols-outlined text-primary">search</span>
          </button>
        )}

        {loading ? (
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL ?? undefined} alt={profile?.displayName ?? user.email ?? ""} />
                  <AvatarFallback className="text-sm">
                    {(profile?.displayName ?? user.email ?? "?")
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="truncate font-normal text-muted-foreground text-xs">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-surface-variant/40 rounded-full transition-all active:scale-90">
                <span className="material-symbols-outlined text-primary">account_circle</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/login">Sign in</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup">Get started</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile hamburger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="md:hidden p-2 hover:bg-surface-variant/40 rounded-full transition-all">
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {NAV_LINKS.map(({ label, to }) => (
              <DropdownMenuItem key={label} asChild>
                <Link to={to}>{label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
