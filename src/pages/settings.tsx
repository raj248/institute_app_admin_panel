import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Settings page is currently not implemented yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
