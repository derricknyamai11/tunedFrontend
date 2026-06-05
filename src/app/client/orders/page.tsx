"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet, apiPost } from "@/api-client";

/* ─── Review Modal ─── */
function ReviewModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (content.trim().length < 10) return;
    setSubmitting(true);
    const r = await apiPost("/client/testimonials", { content, rating });
    if (r.ok) setDone(true);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Leave a Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {done ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-semibold text-gray-900">Thank you for your review!</p>
            <p className="text-sm text-gray-500 mt-1">It will appear on the site after admin approval.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-400">Close</button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className={`text-2xl ${s <= rating ? "text-amber-400" : "text-gray-200"} hover:scale-110 transition-transform`}>★</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4}
                placeholder="Share your experience with TunedEssays…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
              <p className="text-xs text-gray-400 mt-1">{content.length}/500 characters (min 10)</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={submit} disabled={content.trim().length < 10 || submitting}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface ClientOrder {
  id: string;
  order_number: string;
  title: string;
  status: string;
  paid: boolean;
  total_price: number;
  currency: string;
  word_count: number;
  due_date: string | null;
  is_delivered: boolean;
  created_at: string;
}

interface OrdersResponse {
  orders: ClientOrder[];
  total: number;
  pages: number;
  current_page: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  active: "bg-blue-100 text-blue-700",
  "completed pending review": "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  canceled: "bg-slate-100 text-slate-500",
  revision: "bg-purple-100 text-purple-700",
};

export default function OrdersPage() {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showReview, setShowReview] = useState(false);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const url = `/client/orders?page=${page}${statusFilter ? `&status=${encodeURIComponent(statusFilter)}` : ""}`;
    apiGet<OrdersResponse>(url).then((result) => {
      if (result.ok) setData(result.data);
      else setError(result.error.message);
      setLoading(false);
    });
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data ? `${data.total} orders` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed pending review">Pending Review</option>
            <option value="completed">Completed</option>
            <option value="revision">Revision</option>
            <option value="overdue">Overdue</option>
            <option value="canceled">Cancelled</option>
          </select>
          <Link
            href="/client/orders/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Order
          </Link>
          <button
            onClick={() => setShowReview(true)}
            className="border border-amber-400 text-amber-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
          >
            ⭐ Leave a Review
          </button>
        </div>
      </div>
      {showReview && <ReviewModal onClose={() => setShowReview(false)} />}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && data?.orders.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-gray-400 text-lg mb-2">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Place your first order to get started.
            </p>
            <Link
              href="/client/orders/new"
              className="inline-block bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Place an Order
            </Link>
          </CardContent>
        </Card>
      )}

      {(loading || (data && data.orders.length > 0)) && (
        <div className="space-y-3">
          {loading
            ? [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            : data?.orders.map((o) => (
                <Link key={o.id} href={`/client/orders/${o.id}`}>
                  <Card className="hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-400">
                              #{o.order_number}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-700"}`}
                            >
                              {o.status}
                            </span>
                            {!o.paid && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                                Unpaid
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-gray-900 truncate">{o.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {o.word_count.toLocaleString()} words
                            {o.due_date && ` · Due ${new Date(o.due_date).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-gray-900">
                            {o.currency} {o.total_price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(o.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      )}

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {data.current_page} of {data.pages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
