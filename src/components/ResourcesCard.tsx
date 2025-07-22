import { ExternalLink, Clock, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  location?: string;
  hours?: string;
  contact?: string;
  icon: React.ReactNode;
}

const ResourceCard = ({ 
  title, 
  description, 
  category, 
  location, 
  hours, 
  contact,
  icon 
}: ResourceCardProps) => {
  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-campus-green/10 text-campus-green">
              {icon}
            </div>
            <Badge variant="secondary" className="bg-campus-green/10 text-campus-green hover:bg-campus-green/20">
              {category}
            </Badge>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 group-hover:text-campus-green transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="space-y-2">
          {location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 text-campus-green" />
              {location}
            </div>
          )}
          
          {hours && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-accent" />
              {hours}
            </div>
          )}
          
          {contact && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2 text-secondary" />
              {contact}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Button className="w-full bg-gradient-primary hover:opacity-90">
          Access Resource
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
