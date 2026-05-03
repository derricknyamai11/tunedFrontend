"use client";

import { PrivacySettings } from "../_types/settings.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: PrivacySettings;
  onUpdate: (payload: Partial<PrivacySettings>) => void;
}

export function PrivacyPanel({ data, onUpdate }: Props) {
  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-950">Privacy & Data</CardTitle>
        <CardDescription>Manage who can see your profile and what data you share.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="visibility">Profile Visibility</Label>
          <Select value={data.profile_visibility} onValueChange={(val) => onUpdate({ profile_visibility: val })}>
            <SelectTrigger id="visibility" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends_only">Friends Only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Full Name</Label>
            <div className="text-sm text-muted-foreground">Display your real name instead of username.</div>
          </div>
          <Switch checked={data.show_name} onCheckedChange={(checked) => onUpdate({ show_name: checked })} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Allow Messages</Label>
            <div className="text-sm text-muted-foreground">Let other users send you direct messages.</div>
          </div>
          <Switch checked={data.allow_messages} onCheckedChange={(checked) => onUpdate({ allow_messages: checked })} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Analytics Tracking</Label>
            <div className="text-sm text-muted-foreground">Help us improve by allowing anonymous usage data collection.</div>
          </div>
          <Switch checked={data.analytics_tracking} onCheckedChange={(checked) => onUpdate({ analytics_tracking: checked })} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Search Engine Indexing</Label>
            <div className="text-sm text-muted-foreground">Allow search engines to discover your public profile.</div>
          </div>
          <Switch checked={data.allow_search_engine_indexing} onCheckedChange={(checked) => onUpdate({ allow_search_engine_indexing: checked })} />
        </div>
      </CardContent>
    </Card>
  );
}
