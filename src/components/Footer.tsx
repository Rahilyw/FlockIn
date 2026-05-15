import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import flockInLogo from "@/assets/FlockIn-login.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={flockInLogo}
                alt="FlockIn"
                className="h-8 w-auto max-h-8 object-contain object-left"
              />
              <span className="text-xl font-bold">FlockIn!!</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Your central hub for campus life. Discover events, join clubs, and access resources 
              that make your university experience unforgettable.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#events" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#clubs" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Clubs
                </a>
              </li>
              <li>
                <a href="#resources" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Calendar
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">123 University Ave, Campus City</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span className="text-sm">(555) 123-FLOCK</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@flockin.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 FlockIn!!. Made with ❤️ for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;