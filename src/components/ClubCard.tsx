import { Users, Mail, ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClubCardProps {
  name: string;
  description: string;
  category: string;
  members: number;
  rating: number;
  tags: string[];
  image?: string;
}

const ClubCard = ({ 
  name, 
  description, 
  category, 
  members, 
  rating, 
  tags,
  image 
}: ClubCardProps) => {
  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
            {category}
          </Badge>
          <div className="flex items-center text-muted-foreground text-sm">
            <Star className="h-4 w-4 mr-1 fill-current text-accent" />
            {rating}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
          {name}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Users className="h-4 w-4 mr-2 text-primary" />
          {members} members
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-muted hover:bg-muted/50"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-muted">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1">
          <Mail className="mr-2 h-4 w-4" />
          Contact
        </Button>
        <Button className="flex-1 bg-gradient-primary hover:opacity-90">
          Join Club
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClubCard;