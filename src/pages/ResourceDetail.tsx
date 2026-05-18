import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useResourceDetail } from "@/hooks/useResourceDetail";
import type { ResourceType } from "@/types/firebaseTypes";
import type { ReactNode } from "react";



const typeIcons: Record<ResourceType, ReactNode> = {
  link: <ExternalLink className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  room: <MapPin className="h-4 w-4" />,
  service: <Wrench className="h-4 w-4" />,
};



// ── Resource Detail Page ─────────────────────────────────────────────
/** * ResourceDetail component displays detailed information about a specific resource.
 * It uses the useResourceDetail hook to fetch resource data based on the ID from the URL parameters.
 * The component handles loading and error states, and displays the resource's title, description, type, location, URL, and tags.
 */

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading } = useResourceDetail(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground text-lg mb-4">Resource not found.</p>
          <Button variant="outline" onClick={() => navigate("/resources")}>
            Back to resources
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="flex items-center gap-1.5 text-sm mt-1">
              {typeIcons[resource.type]}
              {resource.type}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold">{resource.title}</h1>

          <p className="text-foreground leading-relaxed text-base">{resource.description}</p>

          {resource.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{resource.location}</span>
            </div>
          )}

          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Open link
            </a>
          )}

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}