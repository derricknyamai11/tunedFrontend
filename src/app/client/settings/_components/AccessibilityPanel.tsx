"use client";

import { AccessibilitySettings } from "../_types/settings.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: AccessibilitySettings;
  onUpdate: (payload: Partial<AccessibilitySettings>) => void;
}

export function AccessibilityPanel({ data, onUpdate }: Props) {
  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-950">Accessibility</CardTitle>
        <CardDescription>Tailor the interface for your comfort.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Select 
            value={data.font_size_multiplier.toString()} 
            onValueChange={(val) => onUpdate({ font_size_multiplier: parseFloat(val) })}
          >
            <SelectTrigger id="fontSize" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.8">Small (80%)</SelectItem>
              <SelectItem value="1">Normal (100%)</SelectItem>
              <SelectItem value="1.2">Large (120%)</SelectItem>
              <SelectItem value="1.5">Extra Large (150%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>High Contrast Mode</Label>
            <div className="text-sm text-muted-foreground">Increases visibility of elements.</div>
          </div>
          <Switch checked={data.high_contrast_mode} onCheckedChange={(c) => onUpdate({ high_contrast_mode: c })} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Reduced Motion</Label>
            <div className="text-sm text-muted-foreground">Disables animations and transitions.</div>
          </div>
          <Switch checked={data.reduced_motion} onCheckedChange={(c) => onUpdate({ reduced_motion: c })} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enhanced Keyboard Navigation</Label>
            <div className="text-sm text-muted-foreground">Improves focus indicators for keyboard users.</div>
          </div>
          <Switch checked={data.keyboard_navigation_enhanced} onCheckedChange={(c) => onUpdate({ keyboard_navigation_enhanced: c })} />
        </div>
      </CardContent>
    </Card>
  );
}
