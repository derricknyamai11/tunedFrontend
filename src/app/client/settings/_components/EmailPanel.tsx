"use client";

import { EmailSettings } from "../_types/settings.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Props {
  data: EmailSettings;
  onUpdate: (payload: Partial<EmailSettings>) => void;
}

export function EmailPanel({ data, onUpdate }: Props) {
  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-950">Emails & Digests</CardTitle>
        <CardDescription>Control what lands in your inbox.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="frequency">Digest Frequency</Label>
          <Select value={data.frequency} onValueChange={(val) => onUpdate({ frequency: val })}>
            <SelectTrigger id="frequency" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily Summary</SelectItem>
              <SelectItem value="weekly">Weekly Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-emerald-900">Marketing & Products</h3>
          <div className="flex items-center justify-between">
            <Label>Newsletter</Label>
            <Switch checked={data.newsletter} onCheckedChange={(c) => onUpdate({ newsletter: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Promotional Emails</Label>
            <Switch checked={data.promotional_emails} onCheckedChange={(c) => onUpdate({ promotional_emails: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Product Updates</Label>
            <Switch checked={data.product_updates} onCheckedChange={(c) => onUpdate({ product_updates: c })} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4 opacity-70">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-emerald-900">Critical Alerts</h3>
            <p className="text-xs text-muted-foreground italic">These cannot be disabled for security and compliance.</p>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-zinc-500">Order Confirmations</Label>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-zinc-500">Payment Receipts</Label>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-zinc-500">Account Security</Label>
            <Switch checked disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
