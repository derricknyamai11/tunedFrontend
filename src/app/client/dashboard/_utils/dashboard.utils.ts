export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDeadlineDate(isoDate: string | null): string {
  if (!isoDate) return "None";
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const PRIORITY_COLORS = {
  LOW: "bg-slate-100 text-slate-700",
  NORMAL: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
} as const;
export type Priority = keyof typeof PRIORITY_COLORS;

export function getPriorityColorClass(priority: Priority): string {
  return PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.NORMAL;
}

export function getOrderProgressPercent(status: string): number {
  const map: Record<string, number> = {
    PENDING: 10,
    ACTIVE: 45,
    REVISION: 65,
    COMPLETED_PENDING_REVIEW: 85,
    COMPLETED: 100,
    OVERDUE: 45,
    CANCELED: 0,
  };
  return map[status] ?? 0;
}
