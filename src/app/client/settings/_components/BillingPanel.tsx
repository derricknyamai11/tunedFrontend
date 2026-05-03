"use client";

import { BillingSettings } from "../_types/settings.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  data: BillingSettings;
  onUpdate: (payload: Partial<BillingSettings>) => void;
}

export function BillingPanel({ data, onUpdate }: Props) {
  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-950">Billing & Invoices</CardTitle>
        <CardDescription>Manage how you receive payment information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="invoiceEmail">Invoice Email</Label>
          <Input 
            id="invoiceEmail" 
            placeholder="billing@example.com"
            value={data.invoice_email || ""}
            onChange={(e) => onUpdate({ invoice_email: e.target.value })}
            className="w-full md:w-[280px]"
          />
          <div className="text-xs text-muted-foreground">Leave empty to use your primary account email.</div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="delivery">Invoice Delivery</Label>
          <Select value={data.invoice_delivery} onValueChange={(val) => onUpdate({ invoice_delivery: val })}>
            <SelectTrigger id="delivery" className="w-full md:w-[280px]">
              <SelectValue placeholder="Delivery Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email automatically</SelectItem>
              <SelectItem value="download_only">Download only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Reminders</Label>
              <div className="text-sm text-muted-foreground">Send an alert before auto-payments or due dates.</div>
            </div>
            <Switch checked={data.payment_reminders} onCheckedChange={(c) => onUpdate({ payment_reminders: c })} />
          </div>

          {data.payment_reminders && (
            <div className="grid gap-2 pl-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <Label htmlFor="reminder_days" className="text-xs text-emerald-900">Days before due date</Label>
              <Input 
                id="reminder_days"
                type="number"
                min={1}
                max={30}
                value={data.reminder_days_before}
                onChange={(e) => onUpdate({ reminder_days_before: parseInt(e.target.value) || 1 })}
                className="w-24"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
