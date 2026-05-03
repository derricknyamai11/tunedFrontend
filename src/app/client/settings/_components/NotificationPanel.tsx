"use client";

import { NotificationSettings } from "../_types/settings.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Props {
  data: NotificationSettings;
  onUpdate: (payload: Partial<NotificationSettings>) => void;
}

export function NotificationPanel({ data, onUpdate }: Props) {
  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-950">Notifications</CardTitle>
        <CardDescription>Choose how you want to be notified about updates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-emerald-900">Delivery Channels</h3>
          
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch checked={data.email_notifications} onCheckedChange={(c) => onUpdate({ email_notifications: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Push Notifications</Label>
            <Switch checked={data.push_notifications} onCheckedChange={(c) => onUpdate({ push_notifications: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>SMS Notifications</Label>
            <Switch checked={data.sms_notifications} onCheckedChange={(c) => onUpdate({ sms_notifications: c })} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-emerald-900">Events</h3>

          <div className="flex items-center justify-between">
            <Label>Order Updates</Label>
            <Switch checked={data.order_updates} onCheckedChange={(c) => onUpdate({ order_updates: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Payment Notifications</Label>
            <Switch checked={data.payment_notifications} onCheckedChange={(c) => onUpdate({ payment_notifications: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>New Comments</Label>
            <Switch checked={data.comment_notifications} onCheckedChange={(c) => onUpdate({ comment_notifications: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Support Tickets</Label>
            <Switch checked={data.support_ticket_updates} onCheckedChange={(c) => onUpdate({ support_ticket_updates: c })} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
