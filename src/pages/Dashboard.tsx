import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Example protected area — replace with profile, saved events, or settings later.
 */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-lg mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your account</CardTitle>
            <CardDescription>You are signed in. This route is protected by `ProtectedRoute`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-foreground">Email: </span>
              <span className="text-muted-foreground">{user?.email ?? "—"}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Email verified: </span>
              <span className="text-muted-foreground">{user?.emailVerified ? "Yes" : "No"}</span>
            </p>
          </CardContent>
        </Card>
        <Button asChild variant="outline" className="w-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
