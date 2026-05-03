"use client";

import { LocalizationSettings } from "../_types/settings.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: LocalizationSettings;
  onUpdate: (payload: Partial<LocalizationSettings>) => void;
}

export function LocalizationPanel({ data, onUpdate }: Props) {
  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-950">Localization & Formatting</CardTitle>
        <CardDescription>Customize how dates, times, and numbers appear for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="language">Language</Label>
          <Select value={data.language} onValueChange={(val) => onUpdate({ language: val })}>
            <SelectTrigger id="language" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={data.timezone} onValueChange={(val) => onUpdate({ timezone: val })}>
            <SelectTrigger id="timezone" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC (Universal)</SelectItem>
              <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
              <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date_format">Date Format</Label>
          <Select value={data.date_format} onValueChange={(val) => onUpdate({ date_format: val })}>
            <SelectTrigger id="date_format" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select Date Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="time_format">Time Format</Label>
          <Select value={data.time_format} onValueChange={(val) => onUpdate({ time_format: val })}>
            <SelectTrigger id="time_format" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select Time Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12-hour (1:00 PM)</SelectItem>
              <SelectItem value="24h">24-hour (13:00)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
