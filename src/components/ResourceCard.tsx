import { ExternalLink, FileText, MapPin, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Resource, ResourceType } from "@/types/firebaseTypes";
import type { ReactNode } from "react";

interface Props {
  resource: Resource;
  onClick?: (id: string) => void;
}

const typeIcons: Record<ResourceType, ReactNode> = {
  link: <ExternalLink className="h-3 w-3" />,
  document: <FileText className="h-3 w-3" />,
  room: <MapPin className="h-3 w-3" />,
  service: <Wrench className="h-3 w-3" />,
};

export function ResourceCard({ resource, onClick }: Props) {
  return (
    <Card
      className="group cursor-pointer hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50"
      onClick={() => onClick?.(resource.id)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
            {resource.title}
          </h3>
          <Badge variant="outline" className="flex items-center gap-1 text-xs shrink-0">
            {typeIcons[resource.type]}
            {resource.type}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">{resource.description}</p>
        {resource.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{resource.location}</span>
          </div>
        )}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
