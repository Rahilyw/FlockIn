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
  {
    label: "Discover",  icon: "dynamic_feed", to: "/",
    bgOn: "#C95D36", fgOn: "#fff", bgOff: "#FFE0D5", fgOff: "#7c2d12",
    glow: "rgba(201,93,54,.35)",
  },
  {
    label: "Events",    icon: "event",        to: "/events",
    bgOn: "#E89B3C", fgOn: "#fff", bgOff: "#FFE8C7", fgOff: "#7a4a10",
    glow: "rgba(232,155,60,.32)",
  },
  {
    label: "Clubs",     icon: "group",        to: "/clubs",
    bgOn: "#1F8A6E", fgOn: "#fff", bgOff: "#C6F8F1", fgOff: "#0e6258",
    glow: "rgba(31,138,110,.30)",
  },
  {
    label: "Resources", icon: "layers",       to: "/resources",
    bgOn: "#626CDA", fgOn: "#fff", bgOff: "#E2E4FB", fgOff: "#3a44b8",
    glow: "rgba(98,108,218,.32)",
  },
  {
    label: "My Space",  icon: "favorite",     to: "/dashboard",
    bgOn: "#D8188A", fgOn: "#fff", bgOff: "#FFD8DA", fgOff: "#a8323a",
    glow: "rgba(216,24,138,.32)",
  },
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
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/flockin-peacock-pixel.jpeg"
            alt="FlockIn peacock"
            className="w-9 h-9 rounded-lg object-cover shrink-0"
            style={{ imageRendering: 'pixelated', boxShadow: '0 2px 6px rgba(36,140,150,.25), 0 0 0 2px #fff' }}
          />
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            display: 'inline-flex',
          }}>
            <span style={{ color: '#2A6FC8' }}>F</span>
            <span style={{ color: '#1F8A6E' }}>l</span>
            <span style={{ color: '#E89B3C' }}>o</span>
            <span style={{ color: '#0F3D5C' }}>c</span>
            <span style={{ color: '#2A6FC8' }}>k</span>
            <span style={{ color: '#1F8A6E' }}>I</span>
            <span style={{ color: '#E89B3C' }}>n</span>
            <span style={{ color: '#0F3D5C' }}>!</span>
            <span style={{ color: '#2A6FC8' }}>!</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map(({ label, icon, to, bgOn, fgOn, bgOff, fgOff, glow }) => {
            const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <Link
                key={label}
                to={to}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold leading-none transition-all duration-150 fk-press"
                style={{
                  background: isActive ? bgOn : bgOff,
                  color: isActive ? fgOn : fgOff,
                  boxShadow: isActive ? `0 3px 10px ${glow}` : "none",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 15,
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : undefined,
                  }}
                >
                  {icon}
                </span>
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
            <button className="md:hidden p-2 hover:bg-surface-variant/40 rounded-full transition-all fk-press">
              <span className="material-symbols-outlined" style={{ color: "var(--fk-paprika)" }}>menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-2 gap-1 flex flex-col">
            {NAV_LINKS.map(({ label, icon, to, bgOn, fgOn, bgOff, fgOff }) => {
              const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
              return (
                <DropdownMenuItem key={label} asChild>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold w-full"
                    style={{ background: isActive ? bgOn : bgOff, color: isActive ? fgOn : fgOff }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                    {label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
