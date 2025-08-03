"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useProtectAdminRoute } from "@/hooks/useProtectAdminRoute";

export default function Settings() {
  const [autoPublish, setAutoPublish] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [defaultTimeLimit, setDefaultTimeLimit] = useState("60");
  const [allowRetakes, setAllowRetakes] = useState(false);

  const handleSave = () => {
    alert("Settings saved (dummy)");
  };

  useProtectAdminRoute();
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Management Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Auto-publish toggle */}
          <div className="flex items-center justify-between">
            <Label>Auto-publish test papers on creation</Label>
            <Switch checked={autoPublish} onCheckedChange={setAutoPublish} />
          </div>

          {/* Default test time limit */}
          <div className="flex flex-col gap-1">
            <Label>Default test time limit (minutes)</Label>
            <Select value={defaultTimeLimit} onValueChange={setDefaultTimeLimit}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
                <SelectItem value="120">120 min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Daily test limit */}
          <div className="flex flex-col gap-1">
            <Label>Daily Test Limit</Label>
            <Input
              type="number"
              className="w-[120px]"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Default Passing Score (%)</Label>
            <Input type="number" placeholder="50" className="w-24" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Allow Retakes on Failed Tests</Label>
            <Switch checked={allowRetakes} onCheckedChange={setAllowRetakes} />
          </div>
          {allowRetakes && (
            <div className="flex items-center justify-between">
              <Label>Default Number of Retakes Allowed</Label>
              <Input type="number" placeholder="1" className="w-24" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label>Allow PDF Notes Download Without Login</Label>
            <Switch />
          </div>

          {/* Save button */}
          <div className="pt-2">
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
