"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet, apiPost } from "@/api-client";

interface OrderDetail {
  id: string;
  order_number: string;
  title: string;
  description: string;
  status: string;
  paid: boolean;
  total_price: number;
  subtotal: number;
  discount_amount: number;
  currency: string;
  word_count: number;
  page_count: number;
  format_style: string | null;
  report_type: string | null;
  additional_materials: string | null;
  due_date: string | null;
  delivered_at: string | null;
  is_delivered: boolean;
  extension_requested: boolean;
  created_at: string;
  updated_at: string;
  service: { id: string; name: string } | null;
  academic_level: { id: string; name: string } | null;
  deadline: { id: string; name: string; hours: number } | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  active: "bg-blue-100 text-blue-800 border-blue-200",
  "completed pending review": "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
  canceled: "bg-slate-100 text-slate-500 border-slate-200",
  revision: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    apiGet<OrderDetail>(`/client/orders/${orderId}`).then((result) => {
      if (result.ok) setOrder(result.data);
      else setError(result.error.message);
      setLoading(false);
    });
  }, [orderId]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    const result = await apiPost(`/client/orders/${orderId}/cancel`, {});
    if (result.ok) {
      router.push("/client/orders");
    } else {
      alert("Could not cancel: " + (result.ok ? "" : result.error.message));
    }
    setCancelling(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardContent className="space-y-3 pt-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm mb-4">
          {error ?? "Order not found"}
        </div>
        <Link href="/client/orders" className="text-blue-600 hover:underline text-sm">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/client/orders" className="text-sm text-gray-500 hover:text-gray-700">
              Orders
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-700 font-mono">#{order.order_number}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {order.currency} {order.total_price.toFixed(2)}
            </p>
            <Badge variant={order.paid ? "default" : "secondary"} className={order.paid ? "mt-2 bg-green-100 text-green-800" : "mt-2 bg-amber-100 text-amber-700"}>
              {order.paid ? "Paid" : "Payment Pending"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Due Date</p>
            {order.due_date ? (
              <>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.due_date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(order.due_date).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <p className="text-gray-400">Not set</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <Row label="Service" value={order.service?.name} />
            <Row label="Academic Level" value={order.academic_level?.name} />
            <Row label="Deadline" value={order.deadline?.name} />
            <Row label="Word Count" value={`${order.word_count.toLocaleString()} words (${order.page_count} pages)`} />
            {order.format_style && <Row label="Format Style" value={order.format_style} />}
            <Row label="Placed On" value={new Date(order.created_at).toLocaleString()} />
            {order.is_delivered && order.delivered_at && (
              <Row label="Delivered" value={new Date(order.delivered_at).toLocaleString()} />
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.description}</p>
          {order.additional_materials && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">Additional Notes</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.additional_materials}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {order.status === "pending" && (
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {cancelling ? "Cancelling…" : "Cancel Order"}
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm gap-4">
      <dt className="text-gray-500 shrink-0">{label}</dt>
      <dd className="text-gray-900 text-right">{value}</dd>
    </div>
  );
}
