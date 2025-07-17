import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The dashboard page is currently not implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
