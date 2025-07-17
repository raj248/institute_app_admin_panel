import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Trash() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Trash</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Trash page is currently not implemented yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
